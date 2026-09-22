'use client';

import React from 'react';
import { useAuth } from '../lib/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  j2eeLoginUrl?: string;
}

/**
 * Route guard component for React.
 * Automatically verifies JWT session against Spring Boot and redirects
 * to the J2EE login screen if unauthenticated or unauthorized.
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  j2eeLoginUrl = '/login.html',
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p>Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `${j2eeLoginUrl}?redirect=${currentUrl}`;
    }
    return null;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Your role ({user.role}) is not authorized to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
