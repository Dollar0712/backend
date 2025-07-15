import { pool } from '../src/loader/db.js';

async function seedTemperatureData() {
  const now = new Date();
  const deviceId = 'demo-device';
  const values = [];

  // 1. Monthly: one record per month for the past 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1, 12, 0, 0);
    values.push({
      device_id: deviceId,
      value: 20 + Math.sin(i / 2) * 5 + Math.random() * 2,
      timestamp: d.toISOString(),
    });
  }

  // 2. Daily: one record per day for the current month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  for (let i = 0; i < daysInMonth; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1, 10, 0, 0);
    values.push({
      device_id: deviceId,
      value: 18 + Math.sin(i / 3) * 4 + Math.random() * 2,
      timestamp: d.toISOString(),
    });
  }

  // 3. Per-hour for past 24 hours
  for (let i = 24; i > 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    values.push({
      device_id: deviceId,
      value: 15 + Math.sin(d.getHours() / 3) * 3 + Math.random() * 1.5,
      timestamp: d.toISOString(),
    });
  }

  // 4. Per-second for past 1 hour (3600 records)
  for (let i = 3600; i > 0; i--) {
    const d = new Date(now.getTime() - i * 1000);
    values.push({
      device_id: deviceId,
      value: 16 + Math.sin(d.getMinutes() / 10) * 2 + Math.random() * 1.5,
      timestamp: d.toISOString(),
    });
  }

  // Batch insert
  const insertSQL = `INSERT INTO temperature_readings (device_id, value, timestamp) VALUES ($1, $2, $3)`;
  for (const v of values) {
    await pool.query(insertSQL, [v.device_id, v.value, v.timestamp]);
  }
  console.log('✅ Demo temperature data inserted');
  await pool.end();
}

seedTemperatureData().catch(e => {
  console.error('❌ Seed error:', e);
  process.exit(1);
});
