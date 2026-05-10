// gitfolio-server/src/routes/admin/analytics.ts
import { Router } from 'express'
import { prisma } from '../../prisma/client.js'

const router = Router()

// GET /api/admin/analytics/overview
router.get('/overview', async (req, res, next) => {
    try {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const [totalUsers, totalReadmes, totalPushes, newUsersToday, topTemplates] = await Promise.all([
            prisma.user.count(),
            prisma.analyticsEvent.count({ where: { event: 'readme_generated' } }),
            prisma.analyticsEvent.count({ where: { event: 'readme_pushed' } }),
            prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
            prisma.template.findMany({
                where: { isActive: true },
                orderBy: { usageCount: 'desc' },
                take: 10,
                select: { name: true, slug: true, usageCount: true, category: true },
            }),
        ])

        res.json({ totalUsers, totalReadmes, totalPushes, newUsersToday, topTemplates })
    } catch (err) { next(err) }
})

export default router