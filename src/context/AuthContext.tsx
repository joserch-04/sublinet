import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Demo credentials
    if (email === 'admin@sublinet.com' && password === 'admin123') {
      setUser({ id: 'adm-1', name: 'Admin SubliNet', email, role: 'admin' });
      return true;
    }
    if (email === 'jose@gmail.com' && password === 'demo123') {
      setUser({ id: 'usr-1', name: 'Jose', email, role: 'customer' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
