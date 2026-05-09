// gitfolio-server/src/routes/admin/index.ts
import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { adminOnly } from '../../middleware/adminOnly.js'
import analyticsRouter from './analytics.js'
import usersRouter     from './users.js'
import templatesRouter from './templates.js'

const router = Router()
router.use(authenticate, adminOnly)
router.use('/analytics', analyticsRouter)
router.use('/users',     usersRouter)
router.use('/templates', templatesRouter)

export default router