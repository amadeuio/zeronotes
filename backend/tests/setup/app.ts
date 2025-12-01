import request from "supertest";
import { createApp } from "../../src/app";

export function createTestApi() {
  const app = createApp();
  const api = request(app);
  return api;
}
