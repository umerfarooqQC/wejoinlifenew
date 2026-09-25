import React from 'react';
import { ButtonProps } from './Button';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  pill = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      className={`wjl-icon-btn wjl-icon-btn--${variant} wjl-icon-btn--${size} ${pill ? 'wjl-icon-btn--pill' : ''} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      <span className="wjl-icon-btn__icon">{icon}</span>
    </button>
  );
};
