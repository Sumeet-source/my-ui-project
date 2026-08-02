import axios from 'axios';

const api = axios.create({
  // Copy your exact Railway URL and add /api to the end
  baseURL: 'https://welcoming-energy.up.railway.app/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;