import { Octokit } from 'octokit'
import { env } from '../config/env.js'
import type { GitHubProfile } from '../templates/types.js'
import { redis } from '../config/redis.js'

const CACHE_TTL = 300

function getOctokit(token?: string) {
    return new Octokit({
        auth: token || env.GITHUB_TOKEN
    })
}

export async function fetchGitHubProfile(
    username: string,
    token?: string,
): Promise<GitHubProfile> {

    const cacheKey = `gh:profile:${username}`
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached) as GitHubProfile

    const octokit = getOctokit(token)

    const [userRes, reposRes] = await Promise.allSettled([
        octokit.rest.users.getByUsername({ username }),
        octokit.rest.repos.listForUser({
            username,
            sort: 'updated',
            per_page: 100,   // fetch more so star-sort is meaningful
            type: 'owner',
        }),
    ])

    if (userRes.status === 'rejected') {
        const err = userRes.reason as { status?: number }
        if (err.status === 404) {
            throw Object.assign(
                new Error(`GitHub user "${username}" not found`),
                { statusCode: 404 }
            )
        }
        throw Object.assign(new Error('GitHub API error'), { statusCode: 502 })
    }

    const user = userRes.value.data
    const repos = reposRes.status === 'fulfilled' ? reposRes.value.data : []

    const topRepos = repos
        .filter(r => !r.fork && r.description != null)  // narrows description to string
        .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
        .slice(0, 8)
        .map(r => ({
            name: r.name,
            description: r.description ?? null,   // ✅ safe fallback
            html_url: r.html_url,
            stargazers_count: r.stargazers_count ?? 0,  // ✅ number | undefined → number
            forks_count: r.forks_count ?? 0,            // ✅ number | undefined → number
            language: r.language ?? null,
        }))

    // Build language scores weighted by stars
    const langScore: Record<string, number> = {}
    for (const r of repos) {
        if (r.language) {
            langScore[r.language] = (langScore[r.language] ?? 0) + (r.stargazers_count ?? 0) + 1
        }
    }

    const languages = Object.entries(langScore)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([lang]) => lang)

    const profile: GitHubProfile = {
        user: {
            login: user.login,
            name: user.name ?? null,
            bio: user.bio ?? null,
            avatar_url: user.avatar_url,
            location: user.location ?? null,
            company: user.company ?? null,
            blog: user.blog ?? null,
            twitter_username: user.twitter_username ?? null,
            public_repos: user.public_repos,
            followers: user.followers,
            following: user.following,
        },
        topRepos,
        languages,
    }

    await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(profile))
    return profile
}

export async function getAuthenticatedGitHubUser(token: string) {
    const octokit = getOctokit(token)
    const { data } = await octokit.rest.users.getAuthenticated()
    return data
}