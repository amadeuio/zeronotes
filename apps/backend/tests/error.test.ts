import { errorSchema } from '@zeronotes/shared';
import express from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler, notFoundHandler } from '../src/middleware/error.middleware';
import { createTestApi } from './setup/app';
import { makeTestHelpers } from './setup/helpers';

describe('Error Handling Infrastructure', () => {
  const app = express();

  app.use(express.json());
  app.get('/test/random-error', () => {
    throw new Error('Boom!');
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  it('should mask random Errors as 500 SERVER_ERROR', async () => {
    const response = await request(app).get('/test/random-error');

    expect(response.status).toBe(500);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('SERVER_ERROR');
    expect(response.body.error.message).toBe('Internal server error');
    expect(response.body.error.status).toBe(500);
  });

  it('should return 404 for unknown routes formatted by notFoundHandler', async () => {
    const response = await request(app).get('/some-non-existent-route');

    expect(response.status).toBe(404);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.status).toBe(404);
    expect(response.body.error.message).toContain('/some-non-existent-route');
  });
});

describe('Real API Error Scenarios', () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;

  beforeEach(() => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
  });

  it('should return a formatted 404 from the real app', async () => {
    const response = await api.get('/api/not-a-real-endpoint');

    expect(response.status).toBe(404);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('should return a formatted 400 validation error from the real app', async () => {
    const response = await api.post('/api/auth/register').send({
      email: 'not-an-email',
      password: '123',
    });

    expect(response.status).toBe(400);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toBeDefined();
  });

  it('should return a formatted 401 unauthorized error from the real app', async () => {
    const response = await api.get('/api/auth/me');

    expect(response.status).toBe(401);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('AUTH_ERROR');
  });

  it('should return a 404 when updating a non-existent note', async () => {
    const token = await helpers.getAuthToken();
    const nonExistentId = uuidv4();

    const response = await api
      .put(`/api/notes/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Title',
        content: 'New Content',
      });

    expect(response.status).toBe(404);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toContain('Note');
  });

  it('should return a 400 when sending an invalid UUID as a parameter', async () => {
    const token = await helpers.getAuthToken();

    const response = await api
      .delete('/api/notes/not-a-uuid')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toHaveProperty('issues');
  });

  it('should return a 404 when deleting a non-existent label', async () => {
    const token = await helpers.getAuthToken();
    const nonExistentId = uuidv4();

    const response = await api
      .delete(`/api/labels/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    const result = errorSchema.safeParse(response.body);
    expect(result.success).toBe(true);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toContain('Label');
  });
});
