import { initTempSensor, updateTemperature } from "./sensor.js";
import { config } from '../config/index.js';

const sensorConfig = config.sensors?.[0] || { unitId : 1, port : 5020, type :"Temperature Sensor" };

initTempSensor(sensorConfig);

updateTemperature();