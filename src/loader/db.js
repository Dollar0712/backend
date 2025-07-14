import pkg from 'pg';
import { config } from '../app/config/index.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: config.databaseUrl,
});

async function initTemperatureTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS temperature_readings (
      id SERIAL PRIMARY KEY,
      device_id TEXT NOT NULL,
      value REAL NOT NULL,
      unit VARCHAR(10) DEFAULT 'C',
      timestamp TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await pool.query(createTableSQL);
  console.log('✅ temperature_readings table initialized');
}

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected');
    await initTemperatureTable();
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
  }
};

export { pool, connectDB };
