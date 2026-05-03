import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma/client.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

// GET /api/saved — list all saved READMEs
router.get('/', async (req, res, next) => {
    try {
        const readmes = await prisma.savedReadme.findMany({
            where: { userId: req.user!.userId },
            orderBy: { updatedAt: 'desc' },
            include: { template: { select: { name: true, slug: true } } },
        })
        res.json(readmes)
    } catch (err) { next(err) }
})

// POST /api/saved — save a README
router.post('/', async (req, res, next) => {
    const schema = z.object({
        name: z.string().min(1).max(100),
        content: z.string().min(1),
        githubUsername: z.string().min(1),
        templateId: z.string().optional(),
    })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid request' })

    try {
        // Cap at 50 saved READMEs per user
        const count = await prisma.savedReadme.count({ where: { userId: req.user!.userId } })
        if (count >= 50) return res.status(400).json({ message: 'Maximum 50 saved READMEs reached. Delete some first.' })

        const readme = await prisma.savedReadme.create({
            data: {
                ...parsed.data,
                userId: req.user!.userId,
                templateId: parsed.data.templateId ?? null,
            },
        })
        res.status(201).json(readme)
    } catch (err) { next(err) }
})

// PUT /api/saved/:id — update
router.put('/:id', async (req, res, next) => {
    const schema = z.object({ name: z.string().optional(), content: z.string().optional() })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid request' })

    try {
        const readme = await prisma.savedReadme.findFirst({
            where: { id: req.params.id, userId: req.user!.userId },
        })
        if (!readme) return res.status(404).json({ message: 'Not found.' })

        const updated = await prisma.savedReadme.update({
            where: { id: req.params.id },
            data: Object.fromEntries(
                Object.entries(parsed.data).filter(([, v]) => v !== undefined)
            ),
        })
        res.json(updated)
    } catch (err) { next(err) }
})

// DELETE /api/saved/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const readme = await prisma.savedReadme.findFirst({
            where: { id: req.params.id, userId: req.user!.userId },
        })
        if (!readme) return res.status(404).json({ message: 'Not found.' })
        await prisma.savedReadme.delete({ where: { id: req.params.id } })
        res.json({ message: 'Deleted.' })
    } catch (err) { next(err) }
})

export default router