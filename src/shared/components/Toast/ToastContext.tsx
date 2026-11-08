import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { IconCheck } from '../Icons/Icons';

interface ToastItem {
  id: number;
  message: string;
  isFading?: boolean;
}

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idSeq = useRef(1);

  const showToast = useCallback((message: string) => {
    const id = idSeq.current++;
    setToasts((prev) => [...prev, { id, message }]);

    // After 2.8s, trigger fade
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, isFading: true } : t)));
      // After 300ms fade, remove
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container" className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.isFading ? 'toast-fade' : ''}`}>
            <span className="toast-check">
              <IconCheck size={18} />
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
