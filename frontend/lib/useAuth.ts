'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api';
import { setAccessToken, clearAccessToken } from './authStore';

export interface UserMe {
  authenticated: boolean;
  accessToken?: string;
  tokenType?: string;
  email?: string;
  role?: string;
  clientUuid?: string;
  clientId?: string;
  siteIds?: number[];
  profile?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Initial Handshake: Calls Spring Boot /me endpoint with cookies attached
      const response = await apiClient.get<UserMe>('/wjlapi/api/v1/auth/me');
      
      if (response.data && response.data.authenticated) {
        // 2. Store access token strictly in JavaScript memory (NOT localStorage)
        if (response.data.accessToken) {
          setAccessToken(response.data.accessToken);
        }
        setUser(response.data);
      } else {
        clearAccessToken();
        setUser(null);
      }
    } catch (err: any) {
      clearAccessToken();
      setUser(null);
      setError(err?.response?.data?.message || 'Unauthorized');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (j2eeLoginUrl: string = '/login.html') => {
    try {
      await apiClient.post('/wjlapi/api/v1/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearAccessToken();
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = j2eeLoginUrl;
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated: !!user?.authenticated,
    isLoading,
    error,
    refreshAuth: checkAuth,
    logout,
  };
}
