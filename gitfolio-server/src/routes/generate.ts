import { z } from 'zod';
import { Router } from 'express'
import { optionalAuth } from '../middleware/auth.js';
import { generateLimiter } from '../middleware/rateLimiter.js';
import { templateRegistry } from '../services/templateRegistry.js';
import { fetchGitHubProfile } from '../services/github.js';
import type { TemplateOptions } from '../templates/types.js';
import { generateReadme } from '../services/readmeGenerator.js';

const router = Router()

const generateSchema = z.object({
    username: z.string().min(1).max(39),
    templateId: z.string().min(1),
    options: z.object({
        theme: z.string().optional(),
        sections: z.array(z.string()).optional(),
    }).optional(),
})

router.post('/', generateLimiter, optionalAuth, async (req, res, next) => {
    const parsed = generateSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400)
            .json({
                message: 'Invalid request',
                errors: parsed.error.flatten()
            })
    }

    const { username, templateId, options } = parsed.data;

    const template = templateRegistry.get(templateId);

    if (!template) {
        return res.status(404)
            .json({
                message: `Template "${templateId}" not found.`
            })
    }

    if (template.meta.tier === 'premium' && !req.user) {
        return res.status(403)
            .json({
                message: 'Login required to use premium templates.'
            })
    }

    try {
        const profile = await fetchGitHubProfile(username, req.user?.ghToken);

        const templateOptions: TemplateOptions = {}
        if (options?.theme) templateOptions.theme = options.theme
        if (options?.sections) templateOptions.sections = options.sections

        const markdown = await generateReadme(templateId, profile, templateOptions, req.user?.userId)
        res.json({ markdown, profile })

    } catch (err: any) {
        if (err.statusCode === 404) {
            return res.status(404)
                .json({
                    message: err.message
                })
        }
        return next(err)
    }
})

export default router
