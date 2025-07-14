import express from 'express';
import {
  getAllTemperatureReadings,
  getAllDevices,
  getSimulatedSensorSettings,
  setSimulatedSensorSettings
} from '../controller/temperatureController.js';

const router = express.Router();

router.get('/temperature-readings', getAllTemperatureReadings);

router.get('/devices', getAllDevices);

router.get('/get-simulated-sensor-settings', getSimulatedSensorSettings);

router.post('/set-simulated-sensor-settings', setSimulatedSensorSettings);

export default router;
