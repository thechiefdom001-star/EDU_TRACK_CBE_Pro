import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromStorage, saveToStorage } from '@/lib/storage';

interface Admin {
  username: string;
  name: string;
  role: 'admin' | 'superadmin';
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  name: 'System Administrator',
  role: 'superadmin' as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() => 
    getFromStorage('sms_kenya_admin', null)
  );

  const isAuthenticated = !!admin;

  useEffect(() => {
    saveToStorage('sms_kenya_admin', admin);
  }, [admin]);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setAdmin({
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
