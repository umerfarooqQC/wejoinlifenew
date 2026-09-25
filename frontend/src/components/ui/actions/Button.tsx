import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  pill?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  pill = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const classNames = [
    'wjl-btn',
    `wjl-btn--${variant}`,
    `wjl-btn--${size}`,
    fullWidth ? 'wjl-btn--full' : '',
    pill ? 'wjl-btn--pill' : '',
    isLoading ? 'wjl-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="wjl-btn__spinner" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="wjl-btn__icon wjl-btn__icon--left">{leftIcon}</span>
      ) : null}
      
      {children && <span className="wjl-btn__content">{children}</span>}

      {!isLoading && rightIcon && (
        <span className="wjl-btn__icon wjl-btn__icon--right">{rightIcon}</span>
      )}
    </button>
  );
};

export const PrimaryButton: React.FC<ButtonProps> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<ButtonProps> = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<ButtonProps> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<ButtonProps> = (props) => (
  <Button variant="danger" {...props} />
);
