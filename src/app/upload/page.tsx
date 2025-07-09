'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Header */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-200/50 dark:border-gray-700/50">
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OptiLearn
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Retour au dashboard
            </Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Bientôt disponible
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
              La fonctionnalité d'upload de PDF est en cours de développement et sera bientôt disponible.
              Merci de votre patience !
            </p>
            
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au dashboard
            </Link>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 