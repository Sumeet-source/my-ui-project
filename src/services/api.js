import axios from 'axios';

// Environment variable for Vite
const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json' },
});

// YE BLOCK Har request ke saath token bhejega
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// Signup function
export const signupUser = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  return response.data;
};

// Login function
export const loginUser = async (userData) => {
  const response = await api.post('/api/auth/login', userData);
  return response.data;
};

export default api;