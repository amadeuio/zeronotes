import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '../utils/AppError';

export const validate =
  <T extends z.ZodTypeAny>(schema: T, property: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ');
      return next(new ValidationError(message));
    }

    req[property] = result.data;
    next();
  };
