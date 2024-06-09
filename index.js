const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const connectedUsers = new Map();

io.on('connection', (socket) => {
  
  const userId = socket.handshake.query.userId;
  connectedUsers.set(socket.id, {idUserConectado: userId});


    socket.on('joinRoom', (roomId) => {
    socket.join(roomId);

    connectedUsers.set(socket.id, { ...connectedUsers.get(socket.id), roomIdConectado: roomId }); // Update room ID
    
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    const connectedUser = connectedUsers.get(socket.id);
    if (connectedUser && connectedUser.roomIdConectado === roomId) {
      connectedUser.roomIdConectado = null; // Remove room ID
    }
  });
  
  // Room
  socket.on('sendMessage', (message) => {
    const recipientId = message.recipientId;
    const chatId = message.chatId;
    const recipientSocketId = obtenerClavePorValor(connectedUsers, `${recipientId}`);
    const numUsers = io.sockets.adapter.rooms.get(`${chatId}`)?.size || 0;
    
    if (numUsers==2) {
      const socketConectado = connectedUsers.get(socket.id);
      const usuarioId = socketConectado.idUserConectado;
      socket.to(`${chatId}`).emit('messageReceived', {message, usuarioId});
    } else if (recipientSocketId) {
      const recipientSocket = io.sockets.sockets.get(recipientSocketId);
      if (recipientSocket) {
        const messageWithRoomId = { ...message, roomId: chatId };
        recipientSocket.emit('privateMessage', messageWithRoomId);
      } else {
        // Recipient not online, handle accordingly (e.g., store message for later delivery)
      }
    } else {
      // Recipient not online and no socket found, handle accordingly
    }
  });
      // Handle user disconnection when the socket disconnects
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
    });


  });

  // Función para obtener la clave a partir de un valor
function obtenerClavePorValor(map, valorBuscado) {
  for (let [clave, valor] of map.entries()) {
      if (valor.idUserConectado === valorBuscado) {
          return clave;
      }
  }
  return undefined; // Si no se encuentra el valor, devolver undefined
}
  
  // Escuchar en el puerto 3000 (o cualquier puerto de tu elección)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});