

import net from 'net';
import modbus from 'jsmodbus';

// Register addresses
const TEMP_REGISTER = 0;
const SIGNAL_REGISTER = 2;
const AMPLITUDE_REGISTER = 4;
const INTERVAL_REGISTER = 6;

let holdingRegisters;
let base = 25;

export function initSensor(sensorConfig) {
  const { unitId, port } = sensorConfig;
  // Default temperature and settings
  const temperature = 251;
  const signalEnabled = true;
  const amplitude = 10;
  const intervalMs = 1000;

  holdingRegisters = Buffer.alloc(100); // 50 registers (2 bytes each)
  
  // Initialize holding registers with default values
  holdingRegisters.writeInt16BE(temperature, TEMP_REGISTER);
  holdingRegisters.writeUInt16BE(signalEnabled ? 1 : 0, SIGNAL_REGISTER);
  holdingRegisters.writeUInt16BE(amplitude, AMPLITUDE_REGISTER);
  holdingRegisters.writeUInt16BE(intervalMs, INTERVAL_REGISTER);

  // Create TCP socket and Modbus server
  const server = net.createServer();
  const modbusServer = new modbus.server.TCP(server, {
    holding: holdingRegisters
  });

  modbusServer.on('connection', socket => {
    console.log('🔌 Modbus client connected');
  });

  server.listen(port, () => {
    console.log(`🚀 Modbus sensor simulator running on port ${port} (unitId=${unitId})`);
  });
}

function getUInt16(addr) {
  return holdingRegisters.readUInt16BE(addr);
}
function getSignalEnabled() {
  return getUInt16(SIGNAL_REGISTER) === 1;
}
function getAmplitude() {
  return getUInt16(AMPLITUDE_REGISTER);
}
function getIntervalMs() {
  return getUInt16(INTERVAL_REGISTER);
}

export function updateTemperature() {
  const enabled = getSignalEnabled();
  const intervalMs = getIntervalMs();
  const amplitude = getAmplitude();

  if (!enabled) {
    setTimeout(updateTemperature, intervalMs);
    return;
  }

  console.log(`Amplitude: ${amplitude}, Interval: ${intervalMs}ms`, `Signal Enabled: ${enabled}`);

  const temp = base + (Math.random() * amplitude * 2 - amplitude);
  const temperature = Math.floor(temp * 10); // 25.1°C → 251
  console.log(`🌡️  Current temperature: ${temp.toFixed(1)} °C`);
  holdingRegisters.writeInt16BE(temperature, TEMP_REGISTER);

  setTimeout(updateTemperature, intervalMs);
}
