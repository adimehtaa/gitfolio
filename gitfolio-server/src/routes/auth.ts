
import type { Request, Response, NextFunction } from 'express'
import { type StringValue } from 'ms'

import axios from 'axios';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Router } from "express";
import { env } from '../config/env.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { getAuthenticatedGitHubUser } from '../services/github.js';
import { redis } from '../config/redis.js';
import { prisma } from '../prisma/client.js';
import { authenticate } from '../middleware/auth.js';


const router = Router()
const pendingStates = new Set<string>();


function signTokens(payload: { userId: string; login: string; role: string; ghToken: string }) {
    const access = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES as StringValue })
    const refresh = jwt.sign({ userId: payload.userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES as StringValue })
    return { access, refresh }
}

router.get('/github', authLimiter, (req, res) => {
    const state = crypto.randomBytes(16).toString('hex')
    pendingStates.add(state)
    setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000)

    const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: env.GITHUB_CALLBACK_URL,
        scope: 'read:user user:email public_repo',
        state,
    })
    res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

router.get('/github/callback', authLimiter, async (req, res, next) => {
    const { code, state } = req.query as { code: string; state: string }
    if (!state || !pendingStates.has(state)) {
        return res.redirect(`${env.CLIENT_URL}?error=invalid_state`)
    }
    pendingStates.delete(state)

    try {
        const { data: tokenData } = await axios.post(
            'https://github.com/login/oauth/access_token',
            { client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code },
            { headers: { Accept: 'application/json' } }
        )
        if (tokenData.error) return res.redirect(`${env.CLIENT_URL}?error=${tokenData.error}`)

        const ghUser = await getAuthenticatedGitHubUser(tokenData.access_token)

        // Upsert user in DB
        const user = await prisma.user.upsert({
            where: { githubId: String(ghUser.id) },
            update: {
                login: ghUser.login,
                name: ghUser.name ?? null,
                email: ghUser.email ?? null,
                avatarUrl: ghUser.avatar_url,
                bio: ghUser.bio ?? null,
            },
            create: {
                githubId: String(ghUser.id),
                login: ghUser.login,
                name: ghUser.name ?? null,
                email: ghUser.email ?? null,
                avatarUrl: ghUser.avatar_url,
                bio: ghUser.bio ?? null,
            },
        })

        const { access, refresh } = signTokens({
            userId: user.id,
            login: user.login,
            role: user.role,
            ghToken: tokenData.access_token,
        })

        // Store refresh token in DB + Redis
        await prisma.user.update({ where: { id: user.id }, data: { refreshToken: refresh } })
        await redis.setEx(`refresh:${user.id}`, 7 * 24 * 3600, refresh)

        // Refresh token in httpOnly cookie
        res.cookie('refresh_token', refresh, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        // Send access token to frontend via redirect
        res.redirect(`${env.CLIENT_URL}/oauth/callback?token=${access}`)
    } catch (err) {
        next(err)
    }
})

router.post('/refresh', async (req, res, next) => {
    const token = req.cookies?.refresh_token
    if (!token) return res.status(401).json({ message: 'No refresh token.' })

    try {
        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string }
        const stored = await redis.get(`refresh:${payload.userId}`)
        if (stored !== token) return res.status(401).json({ message: 'Refresh token revoked.' })

        const user = await prisma.user.findUnique({ where: { id: payload.userId } })
        if (!user) return res.status(401).json({ message: 'User not found.' })

        const { access } = signTokens({
            userId: user.id,
            login: user.login,
            role: user.role,
            ghToken: '', // ghToken not stored — user must re-auth for push
        })

        res.json({ accessToken: access })
    } catch {
        res.status(401).json({ message: 'Invalid refresh token.' })
    }
})

router.post('/logout', authenticate, async (req, res) => {
    await redis.del(`refresh:${req.user!.userId}`)
    res.clearCookie('refresh_token')
    res.json({ message: 'Logged out.' })
})

router.get('/me', authenticate, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: { id: true, login: true, name: true, avatarUrl: true, bio: true, role: true, createdAt: true },
        })
        res.json(user)
    } catch (err) { next(err) }
})

export default router