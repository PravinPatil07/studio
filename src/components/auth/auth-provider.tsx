// src/components/auth/auth-provider.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email?: string) // Accept email for potential future use (e.g. display in profile)
    => void;
  logout: () => void;
  isLoading: boolean;
  userEmail: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for persisted auth state
    try {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedEmail = localStorage.getItem('userEmail');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
        if (storedEmail) setUserEmail(storedEmail);
      }
    } catch (error) {
      // localStorage is not available or other error
      console.warn("Could not access localStorage for auth state:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname.startsWith('/dashboard')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = (email?: string) => {
    setIsAuthenticated(true);
    if (email) setUserEmail(email);
    try {
      localStorage.setItem('isAuthenticated', 'true');
      if (email) localStorage.setItem('userEmail', email);
    } catch (error) {
      console.warn("Could not access localStorage for auth state:", error);
    }
    router.push('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.warn("Could not access localStorage for auth state:", error);
    }
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
