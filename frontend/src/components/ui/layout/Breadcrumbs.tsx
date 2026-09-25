import React from 'react';
import { ChevronRight } from 'lucide-react';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`wjl-breadcrumbs ${className}`}>
      <ol className="wjl-breadcrumbs__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="wjl-breadcrumbs__item">
              {isLast ? (
                <span className="wjl-breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button className="wjl-breadcrumbs__link" onClick={item.onClick}>
                  {item.label}
                </button>
              ) : item.href ? (
                <a href={item.href} className="wjl-breadcrumbs__link">
                  {item.label}
                </a>
              ) : (
                <span className="wjl-breadcrumbs__text">{item.label}</span>
              )}
              {!isLast && <ChevronRight size={14} className="wjl-breadcrumbs__separator" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
