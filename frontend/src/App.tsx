import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { getAccessToken } from '../lib/authStore';
import { apiClient } from '../lib/api';
import RestaurantOnboarding from './components/restaurant/RestaurantOnboarding';
import SellerPortalApp from './features/seller/SellerPortalApp';

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
          to="/restaurant" 
          className={`nav-link-btn ${location.pathname === '/restaurant' ? 'active' : ''}`}
        >
          🍽️ Restaurant Setup
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

        <button onClick={() => logout('/vconnect/login.jsp')} className="btn btn-danger" style={{ marginLeft: '8px' }}>
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
  return <SellerPortalApp />;
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

function isSellerRole(role?: string): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase().trim();
  return normalized === 'seller' || normalized === 'role_seller' || normalized.includes('seller');
}

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // While checking auth handshake via /wjlapi/api/v1/auth/me, display loading indicator
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#16C2D5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: '800',
            marginBottom: '16px',
            boxShadow: '0 4px 14px rgba(22, 194, 213, 0.35)',
          }}
        >
          WJL
        </div>
        <p style={{ color: '#736458', fontSize: '14px', fontWeight: '600' }}>
          Verifying session & user role...
        </p>
      </div>
    );
  }

  const isSeller = isSellerRole(user?.role);

  return (
    <Routes>
      {/* Root path: If seller role, route to /seller, else /dashboard */}
      <Route
        path="/"
        element={
          isSeller || !isAuthenticated ? (
            <Navigate to="/seller" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      {/* Seller Portal Flow */}
      <Route path="/seller/*" element={<SellerPortalApp />} />
      {/* Dashboard & Other Views */}
      <Route path="/dashboard" element={<DashboardView />} />
      <Route path="/restaurant" element={<RestaurantOnboarding />} />
      <Route path="/profile" element={<ProfileView />} />
      {/* Catch-all fallback */}
      <Route
        path="*"
        element={
          isSeller ? (
            <Navigate to="/seller" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    // Crucial: basename="/wjl" ensures all React Router paths are under /wjl
    <BrowserRouter
      basename="/wjl"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  );
}

