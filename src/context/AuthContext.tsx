import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════
interface User {
  email: string;
  name: string;
  role: 'admin' | 'client';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

// ═══════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════
const AuthContext = createContext<AuthContextType | null>(null);

// Usuarios predefinidos (admin + demo)
const USERS = [
  { email: 'admin@sublinet.com', password: 'admin123', name: 'Admin SubliNet', role: 'admin' as const },
  { email: 'jose@demo.com', password: 'jose123', name: 'Jose', role: 'client' as const },
];

// ═══════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sublinet_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, password: string) => {
    // Buscar en usuarios predefinidos
    let found = USERS.find(u => u.email === email && u.password === password);
    
    // Si no está en predefinidos, buscar en registrados
    if (!found) {
      const registeredUsers = JSON.parse(localStorage.getItem('sublinet_registered_users') || '[]');
      found = registeredUsers.find((u: any) => u.email === email && u.password === password);
    }

    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('sublinet_user', JSON.stringify(userData));
      // ← GUARDAR NOMBRE DEL USUARIO PARA QUE EL ADMIN LO LEA
      localStorage.setItem(`sublinet_user_${found.email}`, JSON.stringify({ 
        name: found.name, 
        email: found.email, 
        role: found.role 
      }));
      return true;
    }
    return false;
  }, []);

  // ← REGISTER CON AUTO-LOGIN Y GUARDADO DE NOMBRE
  const register = useCallback((name: string, email: string, password: string): boolean => {
    const registeredUsers = JSON.parse(localStorage.getItem('sublinet_registered_users') || '[]');
    
    // Verificar si el email ya existe
    const existsInPredefined = USERS.some(u => u.email === email);
    const existsInRegistered = registeredUsers.some((u: any) => u.email === email);
    
    if (existsInPredefined || existsInRegistered) {
      return false;
    }
    
    const newUser = { 
      id: Date.now().toString(), 
      name, 
      email, 
      password,
      role: 'client' as const
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('sublinet_registered_users', JSON.stringify(registeredUsers));
    
    // ← AUTO-LOGIN: iniciar sesión automáticamente después de registrar
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('sublinet_user', JSON.stringify(userData));
    
    // ← GUARDAR NOMBRE DEL USUARIO PARA QUE EL ADMIN LO LEA
    localStorage.setItem(`sublinet_user_${email}`, JSON.stringify({ 
      name, 
      email, 
      role: 'client' 
    }));
    
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sublinet_user');
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register,
        logout, 
        isAdmin: user?.role === 'admin' 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}