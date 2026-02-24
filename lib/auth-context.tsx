"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from './api';

// Types
export interface User {
  Email: string;
  Username: string | null;
  RegisterDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, turnstileToken?: string) => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  patchUser: (fields: Partial<User>) => void;
  requireAuth: () => boolean;
  requireUsername: () => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  userUnique: string;
  isAgreedContract: boolean;
  age: number;
  turnstileToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const initDone = useRef(false);

  const isAuthenticated = !!user;

  // Fetch current user on mount
  const refreshUser = useCallback(async () => {
    try {
      // _silent: true → interceptor 401 hatasında toast/redirect göstermez
      const response = await api.get('/auth/me', { _silent: true } as any);
      if (response.data.status && response.data.data) {
        const { UserId, userId, ...safeUser } = response.data.data as any;
        setUser(safeUser);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // Initial auth check (StrictMode'da çift çağrıyı önle)
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  // Listen for unauthorized events from API interceptor
  // Sadece kullanıcı giriş yapmışken oturum dolduğunda login'e yönlendir
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser((prev) => {
        if (prev !== null) {
          router.push('/giris-yap');
        }
        return null;
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [router]);

  // Login
  const login = useCallback(async (email: string, password: string, turnstileToken?: string) => {
    const body: any = { email, password };
    if (turnstileToken) body.turnstileToken = turnstileToken;

    await api.post('/auth/login', body);
    // Login successful, fetch user profile
    await refreshUser();
    router.push('/');
  }, [refreshUser, router]);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/register', data);
    return {
      success: response.data.status,
      message: response.data.message,
    };
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if logout API fails, clear local state
    }
    setUser(null);
    router.push('/');
  }, [router]);

  // Forgot password
  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return {
      success: response.data.status,
      message: response.data.message,
    };
  }, []);

  // Resend verification
  const resendVerification = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/resend-verification', { email });
    return {
      success: response.data.status,
      message: response.data.message,
    };
  }, []);

  // Check if user is authenticated, redirect to login if not
  const requireAuth = useCallback((): boolean => {
    if (!isAuthenticated) {
      router.push('/giris-yap');
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  const patchUser = useCallback((fields: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...fields } : prev);
  }, []);

  // Check if user has a username set
  const requireUsername = useCallback((): boolean => {
    if (!user) {
      router.push('/giris-yap');
      return false;
    }
    if (!user.Username) {
      router.push('/profil?setup=username');
      return false;
    }
    return true;
  }, [user, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        forgotPassword,
        resendVerification,
        refreshUser,
        patchUser,
        requireAuth,
        requireUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
