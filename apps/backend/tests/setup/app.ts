import request from 'supertest';
import { createApp } from '../../src/app';

export const createTestApi = () => {
  const app = createApp();
  const api = request(app);
  return api;
};
