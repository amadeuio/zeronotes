import { NextFunction, Request, Response } from 'express';
import { authService } from '../domain/auth/auth.service';
import { AuthError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('No token provided');
    }

    const token = authHeader.substring(7);

    const userId = await verifyToken(token);
    const user = await authService.findById(userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    req.userId = userId;
    next();
  } catch (error) {
    next(error instanceof AuthError ? error : new AuthError('Invalid or expired token'));
  }
};
