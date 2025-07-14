import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  backendUrl: process.env.BACKEND_CONTAINER_NAME ? `http://${process.env.BACKEND_CONTAINER_NAME}:${process.env.PORT}` : `http://localhost:${process.env.PORT}`,
  sensorNetworkName: process.env.MODBUS_SENSOR_CONTAINER_NAME ? process.env.MODBUS_SENSOR_CONTAINER_NAME : '127.0.0.1'
};