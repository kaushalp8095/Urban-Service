import axios from 'axios';

// Use relative URL — Next.js rewrites proxy /api/v1/* → backend
// This eliminates CORS entirely (same-origin from browser's perspective)
const BASE_URL = '/api/v1';

// Default instance for public APIs
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authenticated instance
export const authApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to authApiClient
authApiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
