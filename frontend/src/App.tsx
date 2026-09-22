import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { getAccessToken } from '../lib/authStore';
import { apiClient } from '../lib/api';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-badge">WeJoinLife</span>
        <span className="route-pill">/wjl{location.pathname}</span>
      </div>

      <nav className="navbar-actions">
        <Link 
          to="/dashboard" 
          className={`nav-link-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/seller" 
          className={`nav-link-btn ${location.pathname === '/seller' ? 'active' : ''}`}
        >
          🛍️ Seller Portal
        </Link>
        <Link 
          to="/profile" 
          className={`nav-link-btn ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          👤 Profile
        </Link>

        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '12px' }}>
          {user?.email}
        </span>

        <button onClick={() => logout('/login.html')} className="btn btn-danger" style={{ marginLeft: '8px' }}>
          Sign Out
        </button>
      </nav>
    </header>
  );
}

function DashboardView() {
  const { user } = useAuth();
  const [apiResult, setApiResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const token = getAccessToken();

  const testApi = async () => {
    setLoading(true);
    try {
      // Calls Spring Boot API; apiClient automatically attaches Authorization: Bearer <in_memory_token>
      const res = await apiClient.get('/wjlapi/api/v1/auth/me');
      setApiResult({
        sentHeader: token ? `Bearer ${token.substring(0, 30)}...` : 'None',
        status: res.status,
        timestamp: new Date().toLocaleTimeString(),
        data: res.data
      });
    } catch (err: any) {
      setApiResult({
        error: err.message,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: '700' }}>
            Authorized Dashboard (/wjl/dashboard)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Single Sign-On verified via J2EE Cookie ➔ Exchanged for in-memory Bearer Token.
          </p>
        </div>

        <button onClick={testApi} disabled={loading} className="btn btn-primary">
          {loading ? 'Calling...' : '⚡ Call Protected API (with Bearer Header)'}
        </button>
      </div>

      <div className="grid-4">
        <div className="metric-card">
          <div className="metric-label">User Email</div>
          <div className="metric-value">{user?.email || 'N/A'}</div>
          <div className="metric-sub">Client ID: #{user?.clientId || 'N/A'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Assigned Role</div>
          <div className="metric-value" style={{ textTransform: 'capitalize' }}>{user?.role || 'User'}</div>
          <div className="metric-sub">Profile: {user?.profile || 'Default'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">In-Memory Bearer Token</div>
          <div className="metric-value" style={{ fontSize: '13px', color: '#38bdf8', fontFamily: 'monospace' }}>
            {token ? `${token.substring(0, 20)}...` : 'None'}
          </div>
          <div className="metric-sub" style={{ color: 'var(--accent-emerald)' }}>✓ Memory Only (XSS Safe)</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Current Route</div>
          <div className="metric-value" style={{ color: 'var(--accent-glow)' }}>/wjl/dashboard</div>
          <div className="metric-sub">Base Path: /wjl/</div>
        </div>
      </div>

      <div className="card">
        <div className="code-title-bar">
          <span>AUTHENTICATED USER SESSION DETAILS</span>
          <span style={{ color: 'var(--accent-emerald)' }}>HTTP 200 OK</span>
        </div>
        <pre className="code-container">
          {JSON.stringify(user, null, 2)}
        </pre>

        {apiResult && (
          <div style={{ marginTop: '20px' }}>
            <div className="code-title-bar">
              <span>LIVE API EXECUTION via {apiResult.sentHeader} at {apiResult.timestamp}</span>
              <span style={{ color: 'var(--accent-emerald)' }}>Status: {apiResult.status}</span>
            </div>
            <pre className="code-container">
              {JSON.stringify(apiResult.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function SellerView() {
  const { user } = useAuth();
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ fontFamily: 'Outfit', fontSize: '26px', marginBottom: '8px' }}>
          🛍️ Seller Portal (/wjl/seller)
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Seller workspace for merchant account: <strong>{user?.email}</strong>
        </p>
        <p>Authorized Site IDs: <code>{user?.siteIds?.join(', ') || 'No shops'}</code></p>
      </div>
    </div>
  );
}

function ProfileView() {
  const { user } = useAuth();
  return (
    <div className="container">
      <div className="card">
        <h1 style={{ fontFamily: 'Outfit', fontSize: '26px', marginBottom: '8px' }}>
          👤 Profile Settings (/wjl/profile)
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Client UUID: <code>{user?.clientUuid}</code>
        </p>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading React Portal on /wjl/...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '560px', margin: '80px auto', textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '42px', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Login Required</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            No active J2EE session found. Please log in on the J2EE application to access <code>/wjl/</code>.
          </p>
          <a href="http://localhost:8081/login.html" className="btn btn-primary">
            👉 Go to J2EE Login Screen
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/seller" element={<SellerView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    // Crucial: basename="/wjl" ensures all React Router paths are under /wjl
    <BrowserRouter basename="/wjl">
      <AppContent />
    </BrowserRouter>
  );
}
