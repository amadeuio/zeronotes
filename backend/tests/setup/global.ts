import { closeDB, migrateTestDB, resetTestDB } from "./db";
import "./env";

beforeAll(async () => {
  await migrateTestDB();
});

afterEach(async () => {
  await resetTestDB();
});

afterAll(async () => {
  await closeDB();
});
