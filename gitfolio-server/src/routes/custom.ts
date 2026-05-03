import { Router } from 'express'
import { z } from 'zod'
import { fetchGitHubProfile } from '../services/github.js'
import { generateReadme } from '../services/readmeGenerator.js'
import { templateRegistry } from '../services/templateRegistry.js'
import { optionalAuth } from '../middleware/auth.js'
import { generateLimiter } from '../middleware/rateLimiter.js'
import type { TemplateOptions } from '../templates/types.js'

const router = Router()

const generateSchema = z.object({
    username: z.string().min(1).max(39),
    templateId: z.string().min(1),
    options: z.object({
        theme: z.string().optional(),
        sections: z.array(z.string()).optional(),
    })
        .transform(opts => {
            // Strip keys whose value is undefined so exactOptionalPropertyTypes is satisfied
            const result: Record<string, unknown> = {}
            if (opts.theme !== undefined) result.theme = opts.theme
            if (opts.sections !== undefined) result.sections = opts.sections
            return result as TemplateOptions
        })
        .optional(),
})


router.post('/', generateLimiter, optionalAuth, async (req, res, next) => {
    const parsed = generateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid request', errors: parsed.error.flatten() })

    const { username, templateId, options } = parsed.data

    const template = templateRegistry.get(templateId)
    if (!template) return res.status(404).json({ message: `Template "${templateId}" not found.` })

    // Gate premium templates to logged-in users
    if (template.meta.tier === 'premium' && !req.user) {
        return res.status(403).json({ message: 'Login required to use premium templates.' })
    }

    try {
        const profile = await fetchGitHubProfile(username, req.user?.ghToken)
        if (!req.user?.userId) {
            return res.status(401).json({ message: 'User ID is required.' })
        }
        
        const markdown = await generateReadme(templateId, profile, options, req.user.userId)
        res.json({ markdown, profile })
    } catch (err: any) {
        if (err.statusCode === 404) return res.status(404).json({ message: err.message })
        next(err)
    }
})

export default router