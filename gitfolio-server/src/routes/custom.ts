// gitfolio-server/src/routes/custom.ts
// This handles user-created custom templates (saved block configurations)
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma/client.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

const blockSchema = z.object({
    id: z.string(),
    type: z.string(),
    config: z.record(z.string(), z.unknown()),
})

const templateSchema = z.object({
    name: z.string().min(1).max(80),
    description: z.string().max(300).optional(),
    blocks: z.array(blockSchema).min(1).max(50),
    markdown: z.string(),
    isPublic: z.boolean().optional(),
})

// GET /api/custom-templates
router.get('/', async (req, res, next) => {
    try {
        const templates = await prisma.customTemplate.findMany({
            where: { userId: req.user!.userId },
            orderBy: { updatedAt: 'desc' },
        })
        res.json(templates)
    } catch (err) { next(err) }
})
// POST /api/custom-templates
router.post('/', async (req, res, next) => {
    const parsed = templateSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid request', errors: parsed.error.flatten() })
    }

    try {
        const count = await prisma.customTemplate.count({ where: { userId: req.user!.userId } })
        if (count >= 20) {
            return res.status(400).json({ message: 'Maximum 20 custom templates reached.' })
        }

        const template = await prisma.customTemplate.create({
            data: {
                name: parsed.data.name,
                description: parsed.data.description ?? null,  // undefined → null for Prisma
                blocks: parsed.data.blocks as any,
                markdown: parsed.data.markdown,
                isPublic: parsed.data.isPublic ?? false,
                userId: req.user!.userId,
            },
        })
        res.status(201).json(template)
    } catch (err) { next(err) }
})

// PUT /api/custom-templates/:id
router.put('/:id', async (req, res, next) => {
    const parsed = templateSchema.partial().safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ message: 'Invalid request', errors: parsed.error.flatten() })
    }

    try {
        const existing = await prisma.customTemplate.findFirst({
            where: { id: req.params.id, userId: req.user!.userId },
        })
        if (!existing) {
            return res.status(404).json({ message: 'Not found.' })
        }

        const updated = await prisma.customTemplate.update({
            where: { id: req.params.id },
            data: {
                ...(parsed.data.name !== undefined && { name: parsed.data.name }),
                ...(parsed.data.description !== undefined && { description: parsed.data.description ?? null }),
                ...(parsed.data.blocks !== undefined && { blocks: parsed.data.blocks as any }),
                ...(parsed.data.markdown !== undefined && { markdown: parsed.data.markdown }),
                ...(parsed.data.isPublic !== undefined && { isPublic: parsed.data.isPublic }),
            },
        })
        res.json(updated)
    } catch (err) { next(err) }
})

// DELETE /api/custom-templates/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const existing = await prisma.customTemplate.findFirst({
            where: { id: req.params.id, userId: req.user!.userId },
        })
        if (!existing) {
            return res.status(404).json({ message: 'Not found.' })
        }

        await prisma.customTemplate.delete({ where: { id: req.params.id } })
        res.json({ message: 'Deleted.' })
    } catch (err) { next(err) }
})

export default router