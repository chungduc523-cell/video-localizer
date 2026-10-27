const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/videolocalizer',
  ssl: false,
});

async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    return { ok: true, time: result.rows?.[0]?.now || null };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

module.exports = { pool, testDatabaseConnection };
