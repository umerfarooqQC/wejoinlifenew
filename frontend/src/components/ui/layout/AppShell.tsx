import React, { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  Palette,
  ShoppingBag,
  Store,
  ChevronDown,
  Bell,
  Search,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Avatar } from '../other/Avatar';
import { StatusBadge } from '../data-display/StatusBadge';
import './AppShell.css';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface AppShellProps {
  children: React.ReactNode;
  activeNavId: string;
  onNavSelect: (id: string) => void;
  isMobileDeviceView?: boolean;
  onToggleMobileDeviceView?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeNavId,
  onNavSelect,
  isMobileDeviceView = false,
  onToggleMobileDeviceView,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'review-menu', label: 'Review Your Menu', icon: <UtensilsCrossed size={18} />, badge: 'Active' },
    { id: 'design-showcase', label: 'Design System Showcase', icon: <Palette size={18} /> },
    { id: 'dashboard', label: 'Seller Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Orders & Inventory', icon: <ShoppingBag size={18} />, badge: '12' },
  ];

  return (
    <div className="wjl-app-shell">
      {/* Top Navigation Bar */}
      <header className="wjl-header">
        <div className="wjl-header__left">
          <button
            className="wjl-header__mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="wjl-header__brand">
            <span className="wjl-header__brand-logo">WJL</span>
            <span className="wjl-header__brand-name">Seller Portal</span>
            <StatusBadge status="success" label="Live Portal" size="sm" />
          </div>

          <div className="wjl-header__store-selector">
            <Store size={16} className="wjl-header__store-icon" />
            <span className="wjl-header__store-name">Bella Italia Bistro</span>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="wjl-header__right">
          {onToggleMobileDeviceView && (
            <button
              className={`wjl-device-toggle-btn ${isMobileDeviceView ? 'wjl-device-toggle-btn--active' : ''}`}
              onClick={onToggleMobileDeviceView}
              title="Toggle Mobile Simulator Frame"
            >
              {isMobileDeviceView ? <Smartphone size={16} /> : <Monitor size={16} />}
              <span>{isMobileDeviceView ? 'Mobile View' : 'Desktop View'}</span>
            </button>
          )}

          <div className="wjl-header__search">
            <Search size={16} />
            <input type="text" placeholder="Search Portal..." />
          </div>

          <button className="wjl-header__icon-action" aria-label="Notifications">
            <Bell size={18} />
            <span className="wjl-header__badge-dot" />
          </button>

          <div className="wjl-header__user">
            <Avatar name="Merchant Admin" size="sm" status="online" />
            <span className="wjl-header__user-name">Merchant Admin</span>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <div className="wjl-app-body">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="wjl-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar Navigation */}
        <aside className={`wjl-sidebar ${sidebarOpen ? 'wjl-sidebar--open' : ''}`}>
          <div className="wjl-sidebar__section-label">MAIN MENU</div>
          <nav className="wjl-sidebar__nav">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  className={`wjl-sidebar__item ${isActive ? 'wjl-sidebar__item--active' : ''}`}
                  onClick={() => {
                    onNavSelect(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <span className="wjl-sidebar__item-icon">{item.icon}</span>
                  <span className="wjl-sidebar__item-label">{item.label}</span>
                  {item.badge && (
                    <span className={`wjl-sidebar__badge ${isActive ? 'wjl-sidebar__badge--active' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="wjl-sidebar__footer">
            <div className="wjl-sidebar__footer-card">
              <div className="wjl-sidebar__footer-title">WJL Seller UI 1.0</div>
              <div className="wjl-sidebar__footer-sub">Centralized Design Tokens Active</div>
            </div>
          </div>
        </aside>

        {/* Main Content View Container */}
        <div className="wjl-content-area">{children}</div>
      </div>
    </div>
  );
};
