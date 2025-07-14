import http from 'http';
import { config } from './app/config/index.js';
import { connectDB } from './loader/db.js';
import { initSocketIO } from './loader/socket.js';
import app from './loader/index.js';

await connectDB();

const server = http.createServer(app);
initSocketIO(server);

server.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});
