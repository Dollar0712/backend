import { pool } from '../../loader/db.js';
import { emitToMaster } from '../../loader/socket.js';

export async function getAllTemperatureReadings(params = {}) {
  const { device_id, start, end, limit = 3600, offset = 0 } = params;
  let sql = 'SELECT * FROM temperature_readings WHERE 1=1';
  const values = [];
  let idx = 1;
  if (device_id) {
    sql += ` AND device_id = $${idx++}`;
    values.push(device_id);
  }
  if (start) {
    sql += ` AND timestamp >= $${idx++}`;
    values.push(start);
  }
  if (end) {
    sql += ` AND timestamp <= $${idx++}`;
    values.push(end);
  }
  sql += ` ORDER BY timestamp DESC LIMIT $${idx++} OFFSET $${idx++}`;
  values.push(limit, offset);
  const result = await pool.query(sql, values);
  // Reverse the result so the latest data is first in SQL, but returned oldest to newest
  return result.rows.reverse();
}

export async function getAllDevices() {
  const sql = 'SELECT DISTINCT device_id FROM temperature_readings';
  const result = await pool.query(sql);
  return result.rows.map(row => row.device_id);
}

export async function setSimulatedSensorSettings(settingInfo) {
  emitToMaster('set-temp-sensor-settings', settingInfo);
}

export async function getSimulatedSensorSettings(deviceId) {
  emitToMaster('get-temp-sensor-settings', { device_id : deviceId});
}