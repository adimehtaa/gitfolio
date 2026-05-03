import { createClient } from 'redis'
import { env } from './env.js'

export const redis = createClient({
    url: env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis: too many reconnect attempts, giving up')
                return new Error('Too many retries')
            }
            return Math.min(retries * 100, 3000)
        }
    }
})

redis.on('error', (err) => console.error('Redis error:', err))
redis.on('ready', () => console.log('✓ Redis ready'))
redis.on('reconnecting', () => console.log('Redis reconnecting...'))

export async function connectRedis() {
    if (redis.isOpen) return
    await redis.connect()
}