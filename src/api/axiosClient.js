import axios from 'axios';

// 🟢 FIX: Vercel .env variable use karo, agar nahi hai toh fallback URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://forge-backend-fawn.vercel.app';

const api = axios.create({
  baseURL: API_URL,
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