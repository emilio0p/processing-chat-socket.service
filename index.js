const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      // Send welcome message to the room
      socket.emit('welcome', `Bienvenido a la sala ${roomId}`);
    });
  
    socket.on('message', (message) => {
        
    })
  });
  
  // Escuchar en el puerto 3000 (o cualquier puerto de tu elección)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});