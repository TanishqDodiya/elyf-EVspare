import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout (reduced for faster fallback)
});

// Add a flag to check if we're on the server side
const isServer = typeof window === 'undefined';

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (!isServer) {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log connection errors for debugging
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.warn('Backend server is not running. Using fallback data.');
    }
    
    if (!isServer && error.response?.status === 401) {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } catch (storageError) {
        console.warn('Error accessing localStorage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;