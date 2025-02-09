// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000',
      {
        autoConnect: false,
      }
    );
  }
  return socket;
};
