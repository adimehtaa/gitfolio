import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests, please slow down.' }
})

export const profileFetchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    message: { message: 'Too many profile lookups. Wait a moment.' }
})

export const generateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { message: 'Too many generate requests. Wait a moment.' }
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many auth attempts.' }
})