import { NextFunction, Request, Response } from 'express';
import { RateLimitError } from '../utils/AppError';

interface RateLimitInfo {
  count: number;
  expiresAt: number;
}

export const rateLimit = (limit: number, windowMs: number) => {
  const store = new Map<string, RateLimitInfo>();

  return (req: Request, _res: Response, next: NextFunction) => {
    const ip = req.ip;
    if (!ip) {
      return next(new RateLimitError('No IP address found'));
    }

    const now = Date.now();

    let info = store.get(ip);

    // First request or window expired
    if (!info || now > info.expiresAt) {
      info = {
        count: 1,
        expiresAt: now + windowMs,
      };
      store.set(ip, info);
      return next();
    }

    // Window still active
    if (info.count >= limit) {
      const retryAfterMs = Math.max(0, info.expiresAt - now);
      return next(
        new RateLimitError('Too many requests', {
          retryAfterMs,
          limit,
          windowMs,
        }),
      );
    }

    info.count++;
    store.set(ip, info);
    next();
  };
};
