import pool from '../src/db/client';
import { createTestApi } from './setup/app';
import { makeTestHelpers } from './setup/helpers';

describe('Auth Endpoints', () => {
  let api: any;
  let helpers: ReturnType<typeof makeTestHelpers>;

  beforeEach(() => {
    api = createTestApi();
    helpers = makeTestHelpers(api);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const response = await helpers.registerUser();

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
    });

    it('should return 400 when email is missing', async () => {
      const response = await api.post('/api/auth/register').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await api.post('/api/auth/register').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await api.post('/api/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should return error when registering duplicate email', async () => {
      const uniqueEmail = helpers.uniqueEmail();

      // Register first time
      await helpers.registerUser(uniqueEmail);

      // Try to register again with same email
      const response = await helpers.registerUser(uniqueEmail);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const uniqueEmail = helpers.uniqueEmail();
      await helpers.registerUser(uniqueEmail);

      const response = await helpers.loginUser(uniqueEmail, 'password123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
    });

    it('should return 400 when email is missing', async () => {
      const response = await api.post('/api/auth/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await api.post('/api/auth/login').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
    });

    it('should return 401 when user does not exist', async () => {
      const response = await helpers.loginUser(
        `nonexistent${Date.now()}@example.com`,
        'password123',
      );

      expect(response.status).toBe(401);
    });

    it('should return 401 when password is incorrect', async () => {
      const uniqueEmail = helpers.uniqueEmail();
      await helpers.registerUser(uniqueEmail);

      const response = await helpers.loginUser(uniqueEmail, 'wrongpassword');

      expect(response.status).toBe(401);
    });

    it('should reject login attempt when hash is used as password', async () => {
      const uniqueEmail = helpers.uniqueEmail();
      await helpers.registerUser(uniqueEmail);

      // Get the stored hash from the database
      const client = await pool.connect();
      let storedHash: string;
      try {
        const result = await client.query('SELECT password_hash FROM users WHERE email = $1', [
          uniqueEmail,
        ]);
        storedHash = result.rows[0].password_hash;
      } finally {
        client.release();
      }

      // Try to login using the hash itself as the password
      const response = await helpers.loginUser(uniqueEmail, storedHash);

      // Should fail because the hash is not the actual password
      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('token');
    });

    it('should not leak any user info on failed login', async () => {
      const response = await helpers.loginUser(
        `nonexistent${Date.now()}@example.com`,
        'password123',
      );

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('user');
      expect(JSON.stringify(response.body)).not.toMatch(/\b(email|id|password)\b/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info when authenticated', async () => {
      const token = await helpers.getAuthToken();

      const response = await api.get('/api/auth/me').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await api.get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await api.get('/api/auth/me').set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    it('should return 401 when Authorization header is malformed', async () => {
      const token = await helpers.getAuthToken();

      const response = await api.get('/api/auth/me').set('Authorization', token); // Missing "Bearer" prefix

      expect(response.status).toBe(401);
    });

    it('should not leak any user info on failed authentication', async () => {
      const response = await api.get('/api/auth/me').set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('user');
      expect(response.body).not.toHaveProperty('id');
      expect(response.body).not.toHaveProperty('email');
      expect(JSON.stringify(response.body)).not.toMatch(/\b(email|id|password)\b/i);
    });
  });
});
