const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname);
  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

  for (const file of sqlFiles) {
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`✅ Migration ${file} applied`);
    } catch (err) {
      if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_BAD_TABLE_ERROR') {
        console.log(`⏭️  Migration ${file} already applied or skipped`);
      } else {
        console.error(`❌ Migration ${file} failed:`, err.message);
        process.exit(1);
      }
    }
  }
  console.log('🎉 All migrations completed!');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

