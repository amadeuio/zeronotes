import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code ?? 'SERVER_ERROR',
        status: err.status,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'SERVER_ERROR',
      status: 500,
    },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
      status: 404,
    },
  });
}
