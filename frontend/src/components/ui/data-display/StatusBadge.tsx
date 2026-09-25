import React from 'react';
import './StatusBadge.css';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | string;
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'neutral',
  label,
  size = 'md',
  dot = true,
  className = '',
}) => {
  const normalizedStatus = ['success', 'warning', 'error', 'info'].includes(status)
    ? status
    : 'neutral';

  return (
    <span className={`wjl-badge wjl-badge--${normalizedStatus} wjl-badge--${size} ${className}`}>
      {dot && <span className="wjl-badge__dot" />}
      <span>{label || status}</span>
    </span>
  );
};
