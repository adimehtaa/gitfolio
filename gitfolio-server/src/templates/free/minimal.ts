import type { Template } from '../types.js'

const minimal: Template = {
    meta: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, prose-first layout. No widgets, no clutter.',
        tier: 'free',
        category: 'minimal',
        tags: ['clean', 'simple', 'text'],
        supportedSections: ['header', 'projects', 'skills', 'social'],
    },
    generate(profile, options = {}) {
        const { user, topRepos, languages } = profile
        const sections = options.sections ?? ['header', 'projects', 'skills', 'social']
        const parts: string[] = []

        if (sections.includes('header')) {
            const meta = [
                user.location && `📍 ${user.location}`,
                user.company && `${user.company}`,
            ].filter(Boolean).join(' · ')

            parts.push(`# ${user.name || user.login}\n\n${user.bio || ''}\n\n${meta}`)
        }

        if (sections.includes('projects') && topRepos.length) {
            parts.push(`## Projects\n\n${topRepos.slice(0, 6).map(r =>
                `**[${r.name}](${r.html_url})** — ${r.description || 'No description'}${r.language ? ` \`${r.language}\`` : ''}`
            ).join('\n')}`)
        }

        if (sections.includes('skills') && languages.length) {
            parts.push(`## Skills\n\n${languages.join(' · ')}`)
        }

        if (sections.includes('social')) {
            const links = [
                user.blog && `[Website](${user.blog})`,
                user.twitter_username && `[Twitter](https://twitter.com/${user.twitter_username})`,
                `[GitHub](https://github.com/${user.login})`,
            ].filter(Boolean) as string[]
            parts.push(`## Links\n\n${links.join(' · ')}`)
        }

        return parts.join('\n\n')
    }
}

export default minimal