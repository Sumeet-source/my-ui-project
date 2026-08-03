import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // <--- CHANGE THIS. It must be relative!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
