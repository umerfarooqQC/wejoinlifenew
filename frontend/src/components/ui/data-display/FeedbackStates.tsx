import React from 'react';
import { AlertCircle, Inbox, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../actions/Button';
import './FeedbackStates.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There are no items to display at this time.',
  icon = <Inbox size={40} />,
  action,
  className = '',
}) => {
  return (
    <div className={`wjl-feedback-state wjl-empty-state ${className}`}>
      <div className="wjl-feedback-state__icon">{icon}</div>
      <h3 className="wjl-feedback-state__title">{title}</h3>
      <p className="wjl-feedback-state__desc">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="sm" style={{ marginTop: '16px' }}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading data...',
  className = '',
}) => {
  return (
    <div className={`wjl-feedback-state wjl-loading-state ${className}`}>
      <Loader2 size={32} className="wjl-loading-spinner" />
      <span className="wjl-feedback-state__title" style={{ marginTop: '12px', fontSize: '14px' }}>
        {label}
      </span>
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'Failed to load information. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`wjl-feedback-state wjl-error-state ${className}`}>
      <div className="wjl-feedback-state__icon wjl-feedback-state__icon--error">
        <AlertCircle size={40} />
      </div>
      <h3 className="wjl-feedback-state__title">{title}</h3>
      <p className="wjl-feedback-state__desc">{description}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          style={{ marginTop: '16px' }}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
