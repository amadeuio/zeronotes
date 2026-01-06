import { ErrorResponse } from '@zeronotes/shared';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
) => {
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
};

export const notFoundHandler = (req: Request, res: Response<ErrorResponse>) => {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
      status: 404,
    },
  });
};
