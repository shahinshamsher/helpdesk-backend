import axios from 'axios';

// Shared API client used in browser contexts. This is set to your Render URL.
const BACKEND_BASE_URL = 'https://helpdeskcrm-service.onrender.com';

const base = `${BACKEND_BASE_URL}/api`;

const API = axios.create({ baseURL: base });

console.log('API Base URL:', API.defaults.baseURL);

// attach token (guard for non-browser environments)
API.interceptors.request.use((config) => {
  try {
    const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

export default API;
