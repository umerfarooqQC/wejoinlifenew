import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  header,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`wjl-card wjl-card--${variant} wjl-card--pad-${padding} ${className}`}
      {...props}
    >
      {header && <div className="wjl-card__header">{header}</div>}
      <div className="wjl-card__body">{children}</div>
      {footer && <div className="wjl-card__footer">{footer}</div>}
    </div>
  );
};

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  subtitle,
  className = '',
}) => {
  return (
    <Card className={`wjl-stat-card ${className}`} padding="md">
      <div className="wjl-stat-card__top">
        <span className="wjl-stat-card__title">{title}</span>
        {icon && <div className="wjl-stat-card__icon">{icon}</div>}
      </div>
      <div className="wjl-stat-card__main">
        <span className="wjl-stat-card__value">{value}</span>
        {change && (
          <span className={`wjl-stat-card__change wjl-stat-card__change--${change.type}`}>
            {change.type === 'increase' ? '↑' : change.type === 'decrease' ? '↓' : ''} {change.value}
          </span>
        )}
      </div>
      {subtitle && <p className="wjl-stat-card__sub">{subtitle}</p>}
    </Card>
  );
};
