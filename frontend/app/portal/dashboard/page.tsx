'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { useAuth } from '../../../lib/useAuth';
import { apiClient } from '../../../lib/api';

function AuthorizedDashboardContent() {
  const { user, logout } = useAuth();
  const [testResponse, setTestResponse] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);

  const testApi = async () => {
    setLoadingTest(true);
    try {
      const res = await apiClient.get('/wjlapi/api/v1/auth/me');
      setTestResponse({ status: res.status, data: res.data });
    } catch (err: any) {
      setTestResponse({ error: err.message, status: err.response?.status });
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Authorized Portal (React + Spring Boot)</h1>
          <p style={{ color: '#666' }}>Logged in via J2EE SSO Cookie: <code>wjl_jwt</code></p>
        </div>
        <button 
          onClick={() => logout('/login.html')}
          style={{ padding: '8px 16px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9fafb' }}>
          <small style={{ color: '#888' }}>EMAIL</small>
          <h3>{user?.email}</h3>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9fafb' }}>
          <small style={{ color: '#888' }}>ROLE</small>
          <h3 style={{ textTransform: 'capitalize' }}>{user?.role}</h3>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9fafb' }}>
          <small style={{ color: '#888' }}>CLIENT UUID</small>
          <h4 style={{ wordBreak: 'break-all' }}>{user?.clientUuid || 'N/A'}</h4>
        </div>
      </div>

      <div style={{ padding: '24px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3>Spring Boot Protected API Test</h3>
          <button 
            onClick={testApi}
            disabled={loadingTest}
            style={{ padding: '8px 16px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {loadingTest ? 'Calling...' : 'Call /api/v1/auth/me'}
          </button>
        </div>
        <pre style={{ background: '#111', color: '#38bdf8', padding: '16px', borderRadius: '6px', overflowX: 'auto' }}>
          {testResponse ? JSON.stringify(testResponse, null, 2) : 'Click "Call /api/v1/auth/me" to test live API execution with cookies.'}
        </pre>
      </div>
    </div>
  );
}

export default function AuthorizedDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['seller', 'buyer', 'admin']}>
      <AuthorizedDashboardContent />
    </ProtectedRoute>
  );
}
