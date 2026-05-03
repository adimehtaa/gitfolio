import { Router } from 'express'
import { Octokit } from 'octokit'
import { z } from 'zod'
import { authenticate } from '../middleware/auth.js'
import { prisma } from '../prisma/client.js'

const router = Router()

router.post('/', authenticate, async (req, res, next) => {
    const schema = z.object({
        readme: z.string().min(1).max(500_000),
        savedReadmeId: z.string().optional(),
        commitMessage: z.string().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid request' })

    const { readme, savedReadmeId, commitMessage } = parsed.data
    const octokit = new Octokit({ auth: req.user!.ghToken })

    try {
        const { data: ghUser } = await octokit.rest.users.getAuthenticated()
        const owner = ghUser.login
        const repo = ghUser.login

        // Create profile repo if it doesn't exist
        try {
            await octokit.rest.repos.get({ owner, repo })
        } catch (e: any) {
            if (e.status === 404) {
                await octokit.rest.repos.createForAuthenticatedUser({
                    name: repo, private: false,
                    description: `${owner}'s GitHub profile README`,
                })
            } else throw e
        }

        // Get existing file SHA for update
        let sha: string | undefined
        try {
            const { data } = await octokit.rest.repos.getContent({ owner, repo, path: 'README.md' })
            if (!Array.isArray(data)) sha = data.sha
        } catch { /* new file */ }

        await octokit.rest.repos.createOrUpdateFileContents({
            owner, repo, path: 'README.md',
            message: commitMessage || 'Update profile README',
            content: Buffer.from(readme, 'utf-8').toString('base64'),
            ...(sha ? { sha } : {}),
        })

        // Mark as pushed
        if (savedReadmeId) {
            await prisma.savedReadme.updateMany({
                where: { id: savedReadmeId, userId: req.user!.userId },
                data: { pushedAt: new Date() },
            })
        }

        await prisma.analyticsEvent.create({
            data: { userId: req.user!.userId, event: 'readme_pushed', meta: { login: owner } },
        }).catch(() => { })

        res.json({ success: true, url: `https://github.com/${owner}` })
    } catch (err: any) {
        if (err.status === 403) return res.status(403).json({ message: 'Insufficient GitHub permissions.' })
        next(err)
    }
})

export default router