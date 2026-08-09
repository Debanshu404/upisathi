import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

export const connectSocket = () => {
  return io(socketUrl, {
    withCredentials: true,
    autoConnect: false
  });
};
