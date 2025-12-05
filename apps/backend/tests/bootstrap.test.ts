import { createTestApi } from './setup/app';
import { makeTestHelpers } from './setup/helpers';

describe('Bootstrap Endpoint', () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;
  let token: string;

  beforeEach(async () => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
    token = await helpers.getAuthToken();
  });

  describe('GET /api/bootstrap', () => {
    it('should return bootstrap data for authenticated user', async () => {
      const response = await api.get('/api/bootstrap').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('notes');
      expect(response.body).toHaveProperty('labels');
      expect(Array.isArray(response.body.notes)).toBe(true);
      expect(Array.isArray(response.body.labels)).toBe(true);
      expect(response.body.notes).toHaveLength(0);
      expect(response.body.labels).toHaveLength(0);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.get('/api/bootstrap');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await api.get('/api/bootstrap').set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should return 401 with corrupted token', async () => {
      const response = await api
        .get('/api/bootstrap')
        .set('Authorization', `Bearer ${helpers.corruptTokenSignature(token)}`);

      expect(response.status).toBe(401);
    });
  });
});
