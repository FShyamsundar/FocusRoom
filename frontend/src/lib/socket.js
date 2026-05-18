import { io } from "socket.io-client";

let socket;

const defaultSocketUrl = import.meta.env.DEV
  ? "http://localhost:5000"
  : undefined;

const normalizeSocketUrl = (url) => url?.replace(/\/+$/, "").replace(/\/api$/, "");

export const connectSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl =
    normalizeSocketUrl(import.meta.env.VITE_SOCKET_URL) ||
    normalizeSocketUrl(defaultSocketUrl) ||
    // fallback to same host as API (works on Render when VITE_API_URL is set to https://.../api)
    (import.meta.env.VITE_API_URL
      ? normalizeSocketUrl(import.meta.env.VITE_API_URL)
      : undefined);

  if (!socketUrl) {
    // eslint-disable-next-line no-console
    console.warn("VITE_SOCKET_URL is not set; skipping socket connection");
    return socket;
  }

  socket = io(socketUrl, {
    auth: { token },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
