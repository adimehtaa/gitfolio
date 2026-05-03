import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRouter      from './routes/auth.js'
import profileRouter   from './routes/profile.js'
import templatesRouter from './routes/templates.js'
import generateRouter  from './routes/generate.js'
import savedRouter     from './routes/saved.js'
import pushRouter      from './routes/push.js'
// import adminRouter     from './routes/admin/index.js'
import { env } from './config/env.js'
import { globalLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())
  app.use(globalLimiter)

  app.use('/api/auth',      authRouter)
  app.use('/api/profile',   profileRouter)
  app.use('/api/templates', templatesRouter)
  app.use('/api/generate',  generateRouter)
  app.use('/api/saved',     savedRouter)
  app.use('/api/push',      pushRouter)
//   app.use('/api/admin',     adminRouter)

  app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date() }))

  app.use(errorHandler)
  return app
}