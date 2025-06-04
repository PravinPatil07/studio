
// src/components/auth/auth-provider.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname.startsWith('/dashboard')) {
        router.push('/auth/login');
      } else if (user && (pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/')) {
        // If user is logged in and on an auth page or the landing page, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null); 
      router.push('/auth/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally show a toast message for logout error
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: AuthContextType = {
    isAuthenticated: !!user,
    user,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
