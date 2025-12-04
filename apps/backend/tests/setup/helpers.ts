import { ENCRYPTION_VERSION, KDF_ITERATIONS } from '@zeronotes/shared';
import { SuperTest, Test } from 'supertest';
import { v4 as uuidv4 } from 'uuid';

export function makeTestHelpers(api: SuperTest<Test>) {
  const uniqueEmail = () => `test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

  return {
    uniqueEmail,

    registerUser: async (email: string = 'test@example.com', password: string = 'password123') =>
      api.post('/api/auth/register').send({
        email,
        password,
        encryption: {
          salt: 'dGVzdC1zYWx0',
          wrappedDataKey: 'dGVzdC1rZXk=',
          kdfIterations: KDF_ITERATIONS,
          version: ENCRYPTION_VERSION,
        },
      }),

    loginUser: async (email: string = 'test@example.com', password: string = 'password123') =>
      api.post('/api/auth/login').send({ email, password }),

    getAuthToken: async (
      email: string = uniqueEmail(),
      password: string = 'password123',
    ): Promise<string> => {
      await api.post('/api/auth/register').send({
        email,
        password,
        encryption: {
          salt: 'dGVzdC1zYWx0',
          wrappedDataKey: 'dGVzdC1rZXk=',
          kdfIterations: KDF_ITERATIONS,
          version: ENCRYPTION_VERSION,
        },
      });

      const res = await api.post('/api/auth/login').send({ email, password });
      return res.body.token;
    },

    createNote: async (
      token: string,
      data: { id?: string; title?: string; content?: string } = {},
    ) =>
      api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: data.id ?? uuidv4(),
          title: data.title ?? 'Test Note',
          content: data.content ?? 'Test Content',
        }),

    createLabel: async (token: string, data: { id?: string; name?: string; color?: string } = {}) =>
      api
        .post('/api/labels')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: data.id ?? uuidv4(),
          name: data.name ?? 'Test Label',
        }),

    corruptTokenSignature: (token: string): string => {
      const parts = token.split('.');
      const sig = parts[2];
      const modified = sig.replace(/.$/, (c) => (c === 'a' ? 'b' : 'a'));
      return `${parts[0]}.${parts[1]}.${modified}`;
    },
  };
}
