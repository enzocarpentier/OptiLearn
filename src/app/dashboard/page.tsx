'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Optima
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-600 dark:text-gray-300">
            Bienvenue, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Étudiant'} !
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Bienvenue sur Optima
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Vous êtes maintenant connecté ! Uploadez vos PDFs et créez des quiz intelligents en quelques clics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Authentification fonctionnelle
            </div>
            
            <Link 
              href="/upload"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
            >
              Uploader un PDF
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 inline-block">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Link href="/upload" className="block p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload PDF
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Glissez-déposez vos documents ici
            </p>
            <div className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium">
              Commencer maintenant 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <div className="p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              IA Questions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Génération automatique de quiz
            </p>
            <button className="text-blue-600 text-sm font-medium">
              Bientôt disponible →
            </button>
          </div>

          <div className="p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Suivi Progrès
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Analysez vos performances
            </p>
            <button className="text-blue-600 text-sm font-medium">
              Bientôt disponible →
            </button>
          </div>
        </div>

        {/* Get Started */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white">
            <h2 className="text-2xl font-bold mb-4">
              Prêt à commencer ?
            </h2>
            <p className="mb-6 opacity-90">
              L'interface d'upload et l'IA sont maintenant disponibles !
              Uploadez votre premier PDF pour générer vos quiz personnalisés.
            </p>
            <Link 
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Uploader mon premier PDF
            </Link>
          </div>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
} 