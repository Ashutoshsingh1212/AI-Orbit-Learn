import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[API Error]:', err?.message || err);

  // AppError or custom statusCode
  if (err instanceof AppError || (err && typeof err.statusCode === 'number')) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message || 'An application error occurred',
    });
    return;
  }

  // Prisma unique constraint violation (P2002)
  if (err?.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    res.status(409).json({
      success: false,
      error: `An entry with this ${target} already exists.`,
    });
    return;
  }

  // Prisma record not found (P2025)
  if (err?.code === 'P2025') {
    res.status(404).json({
      success: false,
      error: 'Requested record was not found.',
    });
    return;
  }

  // Prisma connection errors (P1000, P1001, P1002, P1008, P1017, PrismaClientInitializationError)
  if (
    err?.name === 'PrismaClientInitializationError' ||
    err?.name === 'PrismaClientRustPanicError' ||
    (typeof err?.code === 'string' && err.code.startsWith('P10')) ||
    (typeof err?.message === 'string' && (err.message.includes("Can't reach database") || err.message.includes('Connection pool timeout')))
  ) {
    res.status(503).json({
      success: false,
      error: 'Database is temporarily warming up or reconnecting. Please retry in a few moments.',
    });
    return;
  }

  // JWT errors
  if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired session token. Please sign in again.',
    });
    return;
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please try again later.',
  });
};
