import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  databaseUrl: process.env.POSTGRES_CONTAINER_NAME ? process.env.DATABASE_URL : 'postgres://kevin:devpass@localhost:5432/modbusdb',
};
