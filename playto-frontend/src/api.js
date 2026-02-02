import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Double check this matches your Django port
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; // <--- MUST HAVE THIS LINE