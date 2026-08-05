import axios from 'axios';

// 🔥 HARDCODED FIX: Backend URL directly set kiya hai (Vercel env variable issue bypass)
const API_URL = 'https://forge-backend-production-1cef.up.railway.app';

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