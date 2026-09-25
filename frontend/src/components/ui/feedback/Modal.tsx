import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../actions/Button';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="wjl-modal-overlay" onClick={onClose}>
      <div
        className={`wjl-modal wjl-modal--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="wjl-modal__header">
            <h3 className="wjl-modal__title">{title}</h3>
            <button className="wjl-modal__close" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="wjl-modal__body">{children}</div>

        {footer && <div className="wjl-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="wjl-modal__confirm-actions">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="wjl-modal__confirm-message">{message}</p>
    </Modal>
  );
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right',
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="wjl-modal-overlay" onClick={onClose}>
      <div
        className={`wjl-drawer wjl-drawer--${position} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="wjl-drawer__header">
            <h3 className="wjl-drawer__title">{title}</h3>
            <button className="wjl-drawer__close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        )}
        <div className="wjl-drawer__body">{children}</div>
        {footer && <div className="wjl-drawer__footer">{footer}</div>}
      </div>
    </div>
  );
};
