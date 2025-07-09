'use client';

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Main Content */}
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 pb-16">
          <main className="max-w-7xl mx-auto px-6 pt-16">
            <div className="text-center space-y-8 mb-16">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Votre Dashboard
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  OptiLearn
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Gérez vos sessions d'apprentissage et suivez vos progrès grâce à l'intelligence artificielle.
              </p>
            </div>
            
            {/* Grille de masonry avec des rectangles de tailles variées */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">
              
              {/* Upload de PDF - Rectangle large horizontal */}
              <div className="md:col-span-6 lg:col-span-8 text-center space-y-6 p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt disponible
                  </span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Upload de PDF Intelligent
                </h3>
                <p className="text-gray-600 text-lg">
                  Glissez-déposez vos documents PDF et laissez l'IA analyser le contenu pour créer des questions pertinentes et adaptées à votre niveau d'étude.
                </p>
              </div>

              {/* IA Intelligente - Rectangle carré */}
              <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt
                  </span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  IA Intelligente
                </h3>
                <p className="text-gray-600">
                  Notre IA analyse votre contenu et génère automatiquement des questions adaptées à votre niveau d'étude.
                </p>
              </div>

              {/* Quiz Interactifs - Rectangle carré */}
              <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt
                  </span>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quiz Interactifs
                </h3>
                <p className="text-gray-600 text-sm">
                  Révisez avec des quiz dynamiques et suivez vos progrès pour optimiser vos sessions d'apprentissage.
                </p>
              </div>

              {/* Révision Éclair - Rectangle carré */}
              <div className="md:col-span-2 lg:col-span-4 text-center space-y-4 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt
                  </span>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Révision Éclair
                </h3>
                <p className="text-gray-600 text-sm">
                  Sessions de 5-15 minutes pour maximiser votre mémorisation.
                </p>
              </div>

              {/* Statistiques - Rectangle carré */}
              <div className="md:col-span-2 lg:col-span-4 text-center space-y-4 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt
                  </span>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Statistiques
                </h3>
                <p className="text-gray-600 text-sm">
                  Analyses détaillées de vos progrès et domaines à améliorer.
                </p>
              </div>

              {/* Étude Collaborative - Rectangle large horizontal */}
              <div className="md:col-span-4 lg:col-span-8 text-center space-y-4 p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt disponible
                  </span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Étude Collaborative
                </h3>
                <p className="text-gray-600">
                  Partagez vos quiz avec vos amis, créez des groupes d'étude et challengez-vous mutuellement pour rester motivés.
                </p>
              </div>

              {/* Création Assistée - Rectangle carré à droite */}
              <div className="md:col-span-2 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt
                  </span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Création Assistée par IA
                </h3>
                <p className="text-gray-600">
                  Importez vos cours et laissez l'IA générer automatiquement des questions pertinentes.
                </p>
              </div>

              {/* IA Adaptive - Rectangle carré */}
              <div className="md:col-span-3 lg:col-span-6 text-center space-y-4 p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt disponible
                  </span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  IA Adaptive
                </h3>
                <p className="text-gray-600">
                  S'adapte à votre rythme et identifie vos lacunes personnalisées.
                </p>
              </div>

              {/* Expérience & Niveaux */}
              <div className="md:col-span-3 lg:col-span-6 text-center space-y-4 p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bientôt disponible
                  </span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Expérience & Niveaux
                </h3>
                <p className="text-gray-600">
                  Gagnez de l'expérience à chaque session d'étude et montez de niveau pour débloquer de nouvelles fonctionnalités.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 