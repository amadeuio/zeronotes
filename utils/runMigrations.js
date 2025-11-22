const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
require('dotenv').config();

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../migrations');
  
  // Read all migration files
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort alphabetically (001, 002, 003...)

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
        console.error(`❌ Error executing ${file}:`, error.message);
        throw error;
      }
    }

    await client.query('COMMIT');
    console.log('✨ All migrations completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed, rolled back:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

