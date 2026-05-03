import type { Request, Response, NextFunction } from 'express';

export function adminOnly(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required.' })
    }
    next()
}