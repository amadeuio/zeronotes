import cors from 'cors';
import express from 'express';
import { bootstrapRouter } from './domain/bootstrap';
import { labelsRouter } from './domain/labels';
import { notesRouter } from './domain/notes';
import { usersRouter } from './domain/users';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use('/api/bootstrap', bootstrapRouter);
  app.use('/api/auth', usersRouter);
  app.use('/api/notes', notesRouter);
  app.use('/api/labels', labelsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
