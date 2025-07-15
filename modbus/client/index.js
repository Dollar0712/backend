import { connectToBackendSocketIO, connectToSensor } from "./client.js";
import { config } from "../config/index.js";

await connectToBackendSocketIO()
config.sensors.forEach(connectToSensor);