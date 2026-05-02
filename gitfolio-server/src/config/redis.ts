import { createClient } from 'redis'
import { env } from './env.js'

export const redis = createClient({
    url: env.REDIS_URL
})

redis.on('error', (err) => console.error('Redis error:', err))
redis.on('connect', () => console.log('✓ Redis connected'))

export async function connectRedis() {
    await redis.connect()
}