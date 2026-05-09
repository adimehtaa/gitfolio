// gitfolio-server/src/routes/admin/templates.ts
import { Router } from 'express'
import { prisma } from '../../prisma/client.js'
import { z } from 'zod'

const router = Router()

// GET /api/admin/templates
router.get('/', async (req, res, next) => {
    try {
        const templates = await prisma.template.findMany({
            orderBy: { sortOrder: 'asc' },
        })
        res.json(templates)
    } catch (err) { next(err) }
})

// PATCH /api/admin/templates/:id/toggle — enable/disable
router.patch('/:id/toggle', async (req, res, next) => {
    try {
        const t = await prisma.template.findUnique({ where: { id: req.params.id } })
        if (!t) return res.status(404).json({ message: 'Not found.' })

        const updated = await prisma.template.update({
            where: { id: req.params.id },
            data: { isActive: !t.isActive },
        })
        res.json(updated)
    } catch (err) { next(err) }
})

// PATCH /api/admin/templates/:id/feature — toggle featured
router.patch('/:id/feature', async (req, res, next) => {
    try {
        const t = await prisma.template.findUnique({ where: { id: req.params.id } })
        if (!t) return res.status(404).json({ message: 'Not found.' })

        const updated = await prisma.template.update({
            where: { id: req.params.id },
            data: { isFeatured: !t.isFeatured },
        })
        res.json(updated)
    } catch (err) { next(err) }
})

export default router