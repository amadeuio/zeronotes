import { rateLimit } from '../src/middleware/rateLimit.middleware';
import { createTestApi } from './setup/app';
import { makeTestHelpers } from './setup/helpers';

describe('rateLimit middleware', () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;
  let token: string;

  beforeEach(async () => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
    token = await helpers.getAuthToken();
  });

  test('allows requests under limit', () => {
    const middleware = rateLimit(2, 1000);

    const req: any = { ip: '1.1.1.1' };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
  });

  test('blocks after limit exceeded', () => {
    const middleware = rateLimit(1, 1000);

    const req: any = { ip: '2.2.2.2' };
    const res: any = {};
    const next = jest.fn();

    middleware(req, res, next);
    middleware(req, res, next);

    expect(next).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 429,
        code: 'RATE_LIMITED',
      }),
    );
  });

  test('blocks requests when rate limit is exceeded', () => {
    const middleware = rateLimit(1, 1000);

    const req: any = { ip: '2.2.2.2' };
    const res: any = {};
    const next = jest.fn();

    middleware(req, res, next);
    middleware(req, res, next);

    expect(next).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: 429,
        code: 'RATE_LIMITED',
      }),
    );
  });

  test('blocks GET requests after limit is exceeded through full HTTP stack', async () => {
    const authRequests = 2; // getAuthToken() makes 2 requests (register + login)
    const limit = 10;
    const calls = limit + authRequests + 3;

    const statuses = [];

    for (let i = 0; i < calls; i++) {
      const response = await api.get('/api/notes').set('Authorization', `Bearer ${token}`);
      statuses.push(response.status);
    }

    for (let i = 0; i < limit - authRequests; i++) {
      expect(statuses[i]).toBe(200);
    }

    for (let i = limit - authRequests; i < calls; i++) {
      expect(statuses[i]).toBe(429);
    }
  });

  test('blocks POST requests after limit is exceeded through full HTTP stack', async () => {
    const authRequests = 2; // getAuthToken() makes 2 requests (register + login)
    const limit = 10;
    const calls = limit + authRequests + 3;

    const statuses = [];

    for (let i = 0; i < calls; i++) {
      const response = await helpers.createNote(token);
      statuses.push(response.status);
    }

    for (let i = 0; i < limit - authRequests; i++) {
      expect(statuses[i]).toBe(201);
    }

    for (let i = limit - authRequests; i < calls; i++) {
      expect(statuses[i]).toBe(429);
    }
  });
});
