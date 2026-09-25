import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import './PageContainer.css';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  backAction?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  backAction,
  className = '',
}) => {
  return (
    <div className={`wjl-page-header ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="wjl-page-header__main">
        <div className="wjl-page-header__title-group">
          {backAction && <div className="wjl-page-header__back">{backAction}</div>}
          <div>
            <h1 className="wjl-page-header__title">{title}</h1>
            {subtitle && <p className="wjl-page-header__subtitle">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="wjl-page-header__actions">{actions}</div>}
      </div>
    </div>
  );
};

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'xl',
  className = '',
}) => {
  return (
    <main className={`wjl-page-container wjl-page-container--${maxWidth} ${className}`}>
      {children}
    </main>
  );
};
