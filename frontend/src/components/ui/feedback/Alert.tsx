import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import './Alert.css';

export interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  icon,
  onClose,
  action,
  className = '',
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'success': return <CheckCircle2 size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <XCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className={`wjl-alert wjl-alert--${variant} ${className}`}>
      <div className="wjl-alert__icon">{icon || getDefaultIcon()}</div>
      <div className="wjl-alert__content">
        {title && <h4 className="wjl-alert__title">{title}</h4>}
        <div className="wjl-alert__body">{children}</div>
      </div>
      {action && <div className="wjl-alert__action">{action}</div>}
      {onClose && (
        <button className="wjl-alert__close" onClick={onClose} aria-label="Close alert">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
