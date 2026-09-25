import React from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`wjl-tabs wjl-tabs--${variant} wjl-tabs--${size} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`wjl-tab ${isActive ? 'wjl-tab--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span className="wjl-tab__icon">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`wjl-tab__badge ${isActive ? 'wjl-tab__badge--active' : ''}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
