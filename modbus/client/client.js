import { pool } from "../../src/loader/db.js";
import ModbusRTU from "modbus-serial";
import { io } from 'socket.io-client';
import { config } from "../config/index.js";

const clientPool = {};
let socket;

export async function connectToBackendSocketIO() {
  socket = io(config.backendUrl);

  socket.on('connect', () => {
    console.log('✅ Connected to backend Socket.IO server:', socket.id);
  });

  socket.on('set-temp-sensor-settings', async (settingInfo) => {
    try {
      const { device_id, enabled, period, amplitude } = settingInfo;
      await setTempSensorSettings(device_id, enabled, period, amplitude);
    } catch (err) {
      console.error(`❌ Error setting sensor settings: ${err.message}`);
    }
  });

  socket.on('get-temp-sensor-settings', async (query) => {
    const { device_id } = query;
    
    try {
      await getTempSensorSettings(device_id);
    } catch (err) {
      console.error(`❌ Error getting sensor settings for device ${device_id}: ${err.message}`);
    }
  });
}

export async function connectToSensor(sensor) {
  const client = new ModbusRTU();
  try {
    await client.connectTCP(config.sensorNetworkName, { port: sensor.port });
  
    client.setID(sensor.unitId);

    clientPool[`${sensor.type}_${sensor.unitId}`] = client;
  
    setInterval(async () => {
      try {
        const res = await client.readHoldingRegisters(0, 2);
        const tempRaw = res.data[0];
        const tempSigned = tempRaw > 0x7FFF ? tempRaw - 0x10000 : tempRaw;
        const temp = tempSigned / 10;

        await pool.query(
          "INSERT INTO temperature_readings (device_id, value, unit) VALUES ($1, $2, $3)",
          [`${sensor.type}_${sensor.unitId}`, temp, "C"]
        );
      } catch (err) {
        console.error(`❌ Read error on port ${sensor.port}:`, err.message);
        socket.emit('sensor-connection-lost', {
          deviceId: `${sensor.type}_${sensor.unitId}`,
        });
        setTimeout(() => {}, 5000);
      }
    }, 1000);
  } catch (err) {
    console.error(`❌ Connection error on port ${sensor.port}:`, err.message);
    process.exit(1);
  }
}

async function setTempSensorSettings(deviceId, enabled, period, amplitude) {
  try {
    const client = clientPool[deviceId];

    await client.writeRegister(1, enabled ? 1 : 0);
    await client.writeRegister(2, amplitude);
    await client.writeRegister(3, period);
    console.log(`✅ Settings updated for device ${deviceId}: enabled=${enabled}, period=${period}, amplitude=${amplitude}`);
  } catch (err) {
    throw new Error(`❌ Error updating settings for device ${deviceId}: ${err.message}`);
  }
}


async function getTempSensorSettings(deviceId) {
  try {
    const client = clientPool[deviceId];
    if (!client) {
      throw new Error(`No client found for device ${deviceId}`);
    }
    const enabled = await client.readHoldingRegisters(1, 2);
    const amplitude = await client.readHoldingRegisters(2, 2);
    const period = await client.readHoldingRegisters(3, 2);
    socket.emit('receive-sensor-settings', {
      deviceId,
      enabled: enabled.data[0] === 1,
      amplitude: amplitude.data[0],
      period: period.data[0]
    });
    
  } catch (err) {
    throw new Error(`❌ Error getting sensor settings for device ${deviceId}: ${err.message}`);
  }
}
