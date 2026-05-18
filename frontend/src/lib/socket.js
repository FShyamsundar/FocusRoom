import { io } from "socket.io-client";

let socket;

const defaultSocketUrl = import.meta.env.DEV
  ? "http://localhost:5000"
  : undefined;

export const connectSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL ||
    defaultSocketUrl ||
    // fallback to same host as API (works on Render when VITE_API_URL is set to https://.../api)
    (import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
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
