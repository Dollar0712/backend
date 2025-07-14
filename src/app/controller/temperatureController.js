import * as temperatureService from '../service/temperatureService.js';

export async function getAllTemperatureReadings(req, res) {
  try {
    const { device_id, start, end, limit, offset } = req.query;
    const data = await temperatureService.getAllTemperatureReadings({
      device_id,
      start,
      end,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAllDevices(req, res) {
  try {
    const data = await temperatureService.getAllDevices();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function setSimulatedSensorSettings(req, res) {
  try {
    const newSetting = req.body;
    const result = await temperatureService.setSimulatedSensorSettings(newSetting);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSimulatedSensorSettings(req, res) {
  try {
    const { device_id } = req.query;
    await temperatureService.getSimulatedSensorSettings(device_id);
    res.json({ message: 'Settings request sent to modbus master' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
