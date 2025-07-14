import { initSensor, updateTemperature } from "./sensor.js";
import { config } from '../../src/app/config/index.js';

const sensorConfig = config.sensors?.[0] || { unitId: 1, port: 5020 };

initSensor(sensorConfig);
// Start the temperature update loop
updateTemperature();