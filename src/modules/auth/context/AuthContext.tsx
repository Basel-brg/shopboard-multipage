import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, RegisterPayload } from '../auth.types';
import { useToast } from '../../../shared/components/Toast/ToastContext';

const STORAGE_KEY = 'shopboard_user_v1';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  login: (email: string, password?: string, remember?: boolean) => User;
  register: (payload: RegisterPayload) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): User | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const login = useCallback(
    (email: string, _password?: string, remember: boolean = true): User => {
      const newUser: User = {
        name: email.split('@')[0],
        email: email.trim(),
        token: 'demo_token_' + Date.now(),
      };

      setUser(newUser);
      if (remember) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } catch {
          // ignore
        }
      }
      showToast(`مرحباً بك مجدداً، ${newUser.name}!`);
      closeModal();
      return newUser;
    },
    [showToast, closeModal],
  );

  const register = useCallback(
    ({ name, email, phone }: RegisterPayload): User => {
      const newUser: User = {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : undefined,
        token: 'demo_token_' + Date.now(),
      };

      setUser(newUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } catch {
        // ignore
      }
      showToast(`تم إنشاء حسابك بنجاح، أهلاً بك يا ${newUser.name}!`);
      closeModal();
      return newUser;
    },
    [showToast, closeModal],
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('تم تسجيل الخروج بنجاح');
  }, [showToast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isModalOpen,
        openModal,
        closeModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
