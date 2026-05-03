import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectRedis } from './config/redis.js'
import { prisma } from './prisma/client.js'
import { templateRegistry } from './services/templateRegistry.js'

async function main() {
  // Validate connections
  await connectRedis()
  await prisma.$connect()
  console.log('✓ PostgreSQL connected')

  // Load all templates from disk
  await templateRegistry.load()

  const app = createApp()
  app.listen(env.PORT, () => {
    console.log(`✓ Server running on http://localhost:${env.PORT}`)
    console.log(`  Environment: ${env.NODE_ENV}`)
  })
}

main().catch((err) => {
  console.error('Fatal startup error:', err)
  process.exit(1)
})