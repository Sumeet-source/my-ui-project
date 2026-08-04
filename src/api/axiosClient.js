import axios from 'axios';

// Vite ka environment variable uthayega
const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL, // Directly Railway ka URL use karo
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har request mein token bhejne ke liye interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;