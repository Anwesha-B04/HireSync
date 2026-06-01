import axios from 'axios';
import { getToken } from '../utils/jwtStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = config.headers || {};
  config.headers['Cache-Control'] = 'no-cache';
  config.headers.Pragma = 'no-cache';
  return config;
});

export default api;
