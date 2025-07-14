import { Server } from 'socket.io';

let io;

export function initSocketIO(server) {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {  
    registerOnReceiveSensorSettings(io, socket);
    registerOnSensorConnectionLost(io, socket);
    
    socket.on('disconnect', () => {
    });
  });
}

function registerOnReceiveSensorSettings(io, socket) {
  socket.on('receive-sensor-settings', (data) => {
    io.emit('sensor-settings-updated', data);
  });
}

function registerOnSensorConnectionLost(io, socket) {
  socket.on('sensor-connection-lost', (data) => {
    const deviceId = data.deviceId;
    io.emit('sensor-connection-lost', deviceId);
  });
}


export function emitToMaster(event, payload) {
  if (io) {
    io.emit(event, payload);
  }
}
