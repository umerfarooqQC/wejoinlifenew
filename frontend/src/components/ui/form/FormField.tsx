import React from 'react';
import './FormField.css';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  error,
  helpText,
  children,
  className = '',
}) => {
  return (
    <div className={`wjl-form-field ${error ? 'wjl-form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="wjl-form-field__label">
          {label}
          {required && <span className="wjl-form-field__required">*</span>}
        </label>
      )}

      <div className="wjl-form-field__control">{children}</div>

      {error ? (
        <p className="wjl-form-field__error">{error}</p>
      ) : helpText ? (
        <p className="wjl-form-field__help">{helpText}</p>
      ) : null}
    </div>
  );
};

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`wjl-form-section ${className}`}>
      {(title || description) && (
        <div className="wjl-form-section__header">
          {title && <h3 className="wjl-form-section__title">{title}</h3>}
          {description && <p className="wjl-form-section__desc">{description}</p>}
        </div>
      )}
      <div className="wjl-form-section__content">{children}</div>
    </div>
  );
};
