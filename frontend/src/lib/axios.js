import axios from "axios";

const defaultApiUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://focusroom-1-zcd1.onrender.com/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,

  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("focusroom-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
