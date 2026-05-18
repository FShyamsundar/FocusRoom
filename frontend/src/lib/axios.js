import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://focusroom-1-zcd1.onrender.com/api",

  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("focusroom-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});