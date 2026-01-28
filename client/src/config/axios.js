import axios from 'axios';

// Configure base URL for API calls
// In development, uses proxy from package.json
// In production, uses REACT_APP_API_URL environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Log network errors for debugging
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.error('Network Error: Cannot reach backend API. Make sure REACT_APP_API_URL is set in Vercel environment variables.');
    }
    return Promise.reject(error);
  }
);

export default api;

