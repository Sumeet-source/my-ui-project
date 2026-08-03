import axios from 'axios';

const api = axios.create({
  baseURL: 'https://welcoming-energy.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // --- THE FIX: Tells the browser to bypass the CORS preflight check ---
  withCredentials: false,
});

export default api;