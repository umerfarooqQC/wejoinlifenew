import React, { forwardRef } from 'react';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  error,
  className = '',
  rows = 3,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`wjl-textarea ${error ? 'wjl-textarea--error' : ''} ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
