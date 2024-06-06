const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const connectedUsers = new Map();

io.on('connection', (socket) => {
    socket.on('joinRoom', () => {
      const userId = socket.handshake.query.userId;
      const roomId = socket.handshake.query.roomId;
      
      socket.join(roomId);

      connectedUsers.set(socket.id, {idUserConectado: userId, roomIdConectado: roomId });
    });
  
    socket.on('sendMessage', (message) => {
      const socketConectado = connectedUsers.get(socket.id);
      const usuarioID = socketConectado.userId;
      socket.to(socketConectado.roomIdConectado).emit('messageReceived', {message, usuarioID});
    });

      // Handle user disconnection when the socket disconnects
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
    });


  });
  
  // Escuchar en el puerto 3000 (o cualquier puerto de tu elección)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});