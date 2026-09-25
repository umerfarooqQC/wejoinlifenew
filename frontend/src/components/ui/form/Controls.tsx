import React, { forwardRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import './Controls.css';

// Checkbox
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  sublabel,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <label className={`wjl-control-label ${disabled ? 'wjl-control-label--disabled' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        className="wjl-checkbox"
        disabled={disabled}
        {...props}
      />
      {(label || sublabel) && (
        <span className="wjl-control-label__text">
          {label && <span className="wjl-control-label__title">{label}</span>}
          {sublabel && <span className="wjl-control-label__sub">{sublabel}</span>}
        </span>
      )}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

// Radio
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  sublabel,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <label className={`wjl-control-label ${disabled ? 'wjl-control-label--disabled' : ''} ${className}`}>
      <input
        ref={ref}
        type="radio"
        className="wjl-radio"
        disabled={disabled}
        {...props}
      />
      {(label || sublabel) && (
        <span className="wjl-control-label__text">
          {label && <span className="wjl-control-label__title">{label}</span>}
          {sublabel && <span className="wjl-control-label__sub">{sublabel}</span>}
        </span>
      )}
    </label>
  );
});
Radio.displayName = 'Radio';

// Switch / Toggle
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  className = '',
  disabled,
  checked,
  ...props
}, ref) => {
  return (
    <label className={`wjl-switch-label ${disabled ? 'wjl-switch-label--disabled' : ''} ${className}`}>
      <span className={`wjl-switch ${checked ? 'wjl-switch--checked' : ''}`}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="wjl-switch__input"
          {...props}
        />
        <span className="wjl-switch__slider" />
      </span>
      {label && <span className="wjl-switch__title">{label}</span>}
    </label>
  );
});
Switch.displayName = 'Switch';

// DatePicker
export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  error,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <div className="wjl-datepicker-wrapper">
      <input
        ref={ref}
        type="date"
        className={`wjl-input wjl-datepicker ${error ? 'wjl-input--error' : ''} ${className}`}
        disabled={disabled}
        {...props}
      />
      <CalendarIcon size={16} className="wjl-datepicker__icon" />
    </div>
  );
});
DatePicker.displayName = 'DatePicker';
