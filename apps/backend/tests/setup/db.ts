import fs from "fs";
import path from "path";
import pool from "../../src/db/client";

export async function migrateTestDB() {
  const migrationsDir = path.join(__dirname, "..", "..", "db");
  const schemaPath = path.join(migrationsDir, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  const client = await pool.connect();
  try {
    await client.query(sql);
  } finally {
    client.release();
  }
}

export async function resetTestDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      TRUNCATE TABLE note_labels, labels, notes, users 
      RESTART IDENTITY CASCADE;
    `);
  } finally {
    client.release();
  }
}

export async function closeDB() {
  await pool.end();
}
