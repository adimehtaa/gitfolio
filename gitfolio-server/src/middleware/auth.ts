import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export interface AuthPayload {
    userId: string
    login: string
    role: string
    ghToken: string
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required.' })
    }
    try {
        req.user = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AuthPayload
        next()
    } catch {
        res.status(401).json({ message: 'Invalid or expired token.' })
    }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (header?.startsWith('Bearer ')) {
        try {
            req.user = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AuthPayload
        } catch { /* continue as guest */ }
    }
    next()
}