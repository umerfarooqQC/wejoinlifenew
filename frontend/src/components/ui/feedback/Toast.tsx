import React, { useState, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export interface ToastItem {
  id: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (msg: string, type?: ToastItem['type'], title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastItem['type'] = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="wjl-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`wjl-toast wjl-toast--${toast.type || 'info'}`}>
            <div className="wjl-toast__icon">
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
              {toast.type === 'warning' && <AlertCircle size={18} />}
            </div>
            <div className="wjl-toast__content">
              {toast.title && <div className="wjl-toast__title">{toast.title}</div>}
              <div className="wjl-toast__msg">{toast.message}</div>
            </div>
            <button className="wjl-toast__close" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if provider is missing
    return { showToast: (msg: string) => alert(msg) };
  }
  return context;
};

// Tooltip
export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  return (
    <div className="wjl-tooltip-wrapper">
      {children}
      <span className={`wjl-tooltip wjl-tooltip--${position}`}>{content}</span>
    </div>
  );
};
