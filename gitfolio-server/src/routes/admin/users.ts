// gitfolio-server/src/routes/admin/users.ts
import { Router } from 'express'
import { prisma } from '../../prisma/client.js'
import { z } from 'zod'

const router = Router()

// GET /api/admin/users?page=1&search=
router.get('/', async (req, res, next) => {
  const page   = Math.max(1, Number(req.query.page) || 1)
  const search = String(req.query.search || '')
  const take   = 20
  const skip   = (page - 1) * take

  try {
    const where = search
      ? { OR: [{ login: { contains: search } }, { email: { contains: search } }] }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip, take,
        orderBy: { createdAt: 'desc' },
        select: { id: true, login: true, name: true, email: true, avatarUrl: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ])

    res.json({ users, total, page, pages: Math.ceil(total / take) })
  } catch (err) { next(err) }
})

// PATCH /api/admin/users/:id/role  — promote/demote admin
router.patch('/:id/role', async (req, res, next) => {
  const schema = z.object({ role: z.enum(['USER', 'ADMIN']) })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'role must be USER or ADMIN' })

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data:  { role: parsed.data.role },
      select: { id: true, login: true, role: true },
    })
    res.json(user)
  } catch (err) { next(err) }
})

// DELETE /api/admin/users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } })
    res.json({ message: 'User deleted.' })
  } catch (err) { next(err) }
})

export default router