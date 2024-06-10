const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar el servidor de Socket.IO con CORS habilitado
const io = new Server(server, { cors: { origin: '*' } });

// Mapa para mantener a los usuarios conectados
const connectedUsers = new Map();

// Manejar conexiones de clientes
io.on('connection', (socket) => {
  // Obtener el ID del usuario desde la consulta del handshake
  const userId = socket.handshake.query.userId;
  connectedUsers.set(socket.id, { idUserConectado: userId });

  // Manejar cuando un usuario se une a una sala
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    connectedUsers.set(socket.id, { ...connectedUsers.get(socket.id), roomIdConectado: roomId }); // Actualizar ID de la sala
  });

  // Manejar cuando un usuario deja una sala
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    const connectedUser = connectedUsers.get(socket.id);
    if (connectedUser && connectedUser.roomIdConectado === roomId) {
      connectedUser.roomIdConectado = null; // Eliminar ID de la sala
    }
  });

  // Manejar el envío de mensajes
  socket.on('sendMessage', (message) => {
    const recipientId = message.recipientId;
    const chatId = message.chatId;
    const recipientSocketId = obtenerClavePorValor(connectedUsers, `${recipientId}`);
    const numUsers = io.sockets.adapter.rooms.get(`${chatId}`)?.size || 0;

    if (numUsers == 2) {
      const socketConectado = connectedUsers.get(socket.id);
      const usuarioId = socketConectado.idUserConectado;
      socket.to(`${chatId}`).emit('messageReceived', { message, usuarioId });
    } else if (recipientSocketId) {
      const recipientSocket = io.sockets.sockets.get(recipientSocketId);
      if (recipientSocket) {
        const messageWithRoomId = { ...message, roomId: chatId };
        recipientSocket.emit('privateMessage', messageWithRoomId);
      } else {
        // El destinatario no está en línea, manejar en consecuencia (por ejemplo, almacenar el mensaje para entregarlo más tarde)
      }
    } else {
      // El destinatario no está en línea y no se encuentra el socket, manejar en consecuencia
    }
  });

  // Manejar la desconexión del usuario
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
  });
});

// Función para obtener la clave a partir de un valor en el mapa
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
