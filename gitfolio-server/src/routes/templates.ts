import { Router ,type Request} from 'express'
import { optionalAuth } from '../middleware/auth.js'
import { templateRegistry } from '../services/templateRegistry.js'
import { prisma } from '../prisma/client.js'


const router = Router()

router.get('/', optionalAuth, async (req, res) => {
  const isLoggedIn = !!req.user
  const meta = templateRegistry.getMeta()

  const filtered = isLoggedIn ? meta : meta.filter(t => t.tier === 'free')

  // Merge DB metadata (usageCount, isFeatured, isActive)
  const dbTemplates = await prisma.template.findMany({
    where: { slug: { in: filtered.map(t => t.id) }, isActive: true },
    select: { slug: true, usageCount: true, isFeatured: true, sortOrder: true },
  })
  const dbMap = new Map(dbTemplates.map(t => [t.slug, t]))

  const result = filtered
    .map(t => ({ ...t, ...dbMap.get(t.id) }))
    .sort((a, b) => (dbMap.get(a.id)?.sortOrder ?? 0) - (dbMap.get(b.id)?.sortOrder ?? 0))

  res.json(result)
})

router.get('/:id', optionalAuth, async (req : Request<{ id: string }>, res) => {
  const template = templateRegistry.get(req.params.id)
  if (!template) return res.status(404).json({ message: 'Template not found.' })

  // Premium templates need login
  if (template.meta.tier === 'premium' && !req.user) {
    return res.status(403).json({ message: 'Login required to use premium templates.' })
  }

  res.json(template.meta)
})

export default router