import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('news247_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid
      if (localStorage.getItem('news247_token')) {
        console.warn('Session expired or unauthorized.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
