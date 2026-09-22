import axios from 'axios';
import { getAccessToken } from './authStore';

/**
 * Shared API client configured for cross-domain Single Sign-On (SSO).
 * 
 * 1. withCredentials: true ensures that cookies (including `wjl_jwt`)
 *    are automatically included when exchanging session at /auth/me.
 * 2. Interceptor automatically injects Authorization: Bearer <in_memory_token>
 *    to all subsequent API calls without saving tokens to localStorage.
 */
export const apiClient = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor: Automatically attach in-memory Bearer token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
