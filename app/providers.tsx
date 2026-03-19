"use client";

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only" />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#FAF8FF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Caviar Dreams, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#0DF269',
              secondary: '#1a1a2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4B4B',
              secondary: '#1a1a2e',
            },
          },
        }}
      />
    </AuthProvider>
  );
}
