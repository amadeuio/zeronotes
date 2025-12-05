import { NextFunction, Request, Response } from 'express';

interface RateLimitInfo {
  count: number;
  expiresAt: number;
}

export function rateLimit(limit: number, windowMs: number) {
  const store = new Map<string, RateLimitInfo>();

  return function (req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    if (!ip) {
      return res.status(429).json({ error: 'No IP address found' });
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
      return res.status(429).json({ error: 'Too many requests' });
    }

    info.count++;
    store.set(ip, info);
    next();
  };
}
