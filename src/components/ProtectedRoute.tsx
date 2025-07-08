'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push(redirectTo);
    }
  }, [currentUser, loading, router, redirectTo]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
} 