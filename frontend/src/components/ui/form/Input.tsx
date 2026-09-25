import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  error,
  leftIcon,
  rightIcon,
  sizeVariant = 'md',
  className = '',
  disabled,
  ...props
}, ref) => {
  const classNames = [
    'wjl-input',
    `wjl-input--${sizeVariant}`,
    error ? 'wjl-input--error' : '',
    leftIcon ? 'wjl-input--has-left-icon' : '',
    rightIcon ? 'wjl-input--has-right-icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="wjl-input-wrapper">
      {leftIcon && <span className="wjl-input__icon wjl-input__icon--left">{leftIcon}</span>}
      <input
        ref={ref}
        className={classNames}
        disabled={disabled}
        {...props}
      />
      {rightIcon && <span className="wjl-input__icon wjl-input__icon--right">{rightIcon}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  placeholder = 'Search...',
  value,
  onClear,
  onChange,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      leftIcon={<Search size={16} className="wjl-search-icon" />}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';
