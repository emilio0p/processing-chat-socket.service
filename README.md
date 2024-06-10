# Chat Server with Express and Socket.IO

Este proyecto es un servidor de chat en tiempo real utilizando Express y Socket.IO. Permite a los usuarios conectarse, unirse a salas, enviar y recibir mensajes en tiempo real. Además, maneja la desconexión de usuarios y la actualización dinámica de las salas.

## Contenido

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API de Socket.IO](#api-de-socketio)
- [Función Auxiliar](#función-auxiliar)
- [Configuración del Puerto](#configuración-del-puerto)

## Características

- **Conexión de usuarios:** Permite a los usuarios conectarse y desconectarse.
- **Salas de chat:** Los usuarios pueden unirse y abandonar salas específicas.
- **Mensajes en tiempo real:** Permite el envío y recepción de mensajes en tiempo real tanto en salas como de manera privada.
- **Manejo de desconexión:** Actualiza el estado de los usuarios al desconectarse.

## Instalación

Para instalar y ejecutar el servidor, sigue los siguientes pasos:

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tu_usuario/chat-server.git
    cd chat-server
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Inicia el servidor:
    ```bash
    npm start
    ```

## Uso

Una vez iniciado el servidor, este escuchará en el puerto especificado (por defecto, el puerto 3000). Puedes interactuar con el servidor utilizando clientes de Socket.IO desde el navegador o cualquier aplicación que soporte Socket.IO.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura:

├── node_modules

├── package.json

├── package-lock.json

└── server.js


- **node_modules:** Contiene las dependencias del proyecto.
- **package.json:** Archivo de configuración de npm que incluye información sobre las dependencias y scripts.
- **package-lock.json:** Archivo que garantiza la instalación consistente de las dependencias.
- **server.js:** Archivo principal del servidor.

## API de Socket.IO

### Eventos del Cliente

#### `connection`
- Se emite cuando un cliente se conecta.
- **Parámetros:**
  - `socket` - El socket del cliente.

#### `joinRoom`
- Permite a un usuario unirse a una sala específica.
- **Parámetros:**
  - `roomId` - El ID de la sala a la que se une el usuario.

#### `leaveRoom`
- Permite a un usuario abandonar una sala específica.
- **Parámetros:**
  - `roomId` - El ID de la sala que el usuario abandona.

#### `sendMessage`
- Envía un mensaje a una sala o a un usuario específico.
- **Parámetros:**
  - `message` - Objeto que contiene la información del mensaje, incluyendo `recipientId` y `chatId`.

#### `disconnect`
- Se emite cuando un cliente se desconecta.

### Eventos del Servidor

#### `messageReceived`
- Se emite cuando se recibe un mensaje en una sala.
- **Parámetros:**
  - `message` - El mensaje recibido.
  - `usuarioId` - El ID del usuario que envió el mensaje.

#### `privateMessage`
- Se emite cuando se recibe un mensaje privado.
- **Parámetros:**
  - `messageWithRoomId` - El mensaje recibido, incluyendo el ID de la sala.

## Función Auxiliar

### `obtenerClavePorValor(map, valorBuscado)`
- Obtiene la clave de un valor específico en un mapa.
- **Parámetros:**
  - `map` - El mapa en el que se busca.
  - `valorBuscado` - El valor cuya clave se desea encontrar.
- **Retorno:** La clave correspondiente al valor buscado, o `undefined` si no se encuentra.

## Configuración del Puerto

El servidor escucha en el puerto definido en la variable de entorno `PORT`. Si no se define, usa el puerto 3000 por defecto.

```javascript
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
