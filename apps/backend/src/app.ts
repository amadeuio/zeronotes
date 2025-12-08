import cors from 'cors';
import express from 'express';
import { authRouter } from './domain/auth';
import { bootstrapRouter } from './domain/bootstrap';
import { labelsRouter } from './domain/labels';
import { notesRouter } from './domain/notes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimit } from './middleware/rateLimit.middleware';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(rateLimit(10, 10000));
  app.use('/api/bootstrap', bootstrapRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/notes', notesRouter);
  app.use('/api/labels', labelsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
