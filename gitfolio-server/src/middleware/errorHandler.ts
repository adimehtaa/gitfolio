import type { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode || err.status || 500
    const message = err.message || 'Internal server error'

    if (process.env.NODE_ENV === 'development') {
        console.error(`[${req.method}] ${req.path} →`, err)
    }

    res.status(status).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}