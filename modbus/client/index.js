import { connectToBackendSocketIO, connectToSensor } from "./client.js";
import { config } from "../../src/app/config/index.js";

await connectToBackendSocketIO()
config.sensors.forEach(connectToSensor);