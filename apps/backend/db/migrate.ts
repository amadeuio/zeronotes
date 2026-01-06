import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pool from '../src/db/client';

dotenv.config();

const runMigrations = async (): Promise<void> => {
  const migrationsDir = path.join(__dirname);

  // Read all migration files (schema.sql)
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql') && file.includes('schema'))
    .sort();

  console.log(`📦 Found ${files.length} migration file(s)\n`);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`🔄 Running migration: ${file}`);

      try {
        await client.query(sql);
        console.log(`✅ Successfully executed: ${file}\n`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error executing ${file}:`, errorMessage);
        throw error;
      }
    }

    await client.query('COMMIT');
    console.log('✨ All migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Migration failed, rolled back:', errorMessage);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

// Run based on command line argument
const command = process.argv[2];

if (command === 'migrate') {
  runMigrations().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
} else {
  console.error('Usage: ts-node db/migrate.ts migrate');
  process.exit(1);
}
