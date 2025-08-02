// ================================================
// File: /components/AuthContext.tsx
// ================================================
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

interface User {
  employee_id: string;
  access: 'admin' | 'regular';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwt.decode(token) as { employee_id: string; access: 'admin' | 'regular'; exp: number; };
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser({
            employee_id: decoded.employee_id,
            access: decoded.access,
          });
        } else {
          Cookies.remove('token');
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        Cookies.remove('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 15 / (24 * 60) }); // 15 minutes
    try {
      const decoded = jwt.decode(token) as { employee_id: string; access: 'admin' | 'regular'; };
      setUser({
        employee_id: decoded.employee_id,
        access: decoded.access,
      });
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
