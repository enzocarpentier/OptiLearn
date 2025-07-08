'use client';

import Link from 'next/link';

export default function Home() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Optima
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Se connecter
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 hover:scale-105">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Révisez
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              intelligemment
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uploadez vos documents PDF, générez des questions avec l'IA 
            et révisez efficacement grâce à des quiz personnalisés.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/signup" className="group px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium">
              Commencer gratuitement
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 inline-block">
                →
              </span>
            </Link>
            <button 
              onClick={scrollToFeatures}
              className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-lg group"
            >
              Voir les fonctionnalités
              <span className="ml-2 group-hover:translate-y-1 transition-transform duration-200 inline-block">
                ↓
              </span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Nos fonctionnalités
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Découvrez les outils puissants qui vont transformer votre façon d'étudier
            </p>
          </div>
          
          {/* Grille de masonry avec des rectangles de tailles variées */}
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(260px,auto)]">
            
            {/* Upload de PDF - Rectangle large horizontal */}
            <div className="md:col-span-6 lg:col-span-8 text-center space-y-6 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upload de PDF Intelligent
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Glissez-déposez vos documents PDF et laissez l'IA analyser le contenu pour créer des questions pertinentes et adaptées à votre niveau d'étude.
              </p>
            </div>

            {/* IA Intelligente - Rectangle carré */}
            <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                IA Intelligente
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Notre IA analyse votre contenu et génère automatiquement des questions adaptées à votre niveau d'étude.
              </p>
            </div>

            {/* Quiz Interactifs - Rectangle avec plus de contenu */}
            <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quiz Interactifs
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Révisez avec des quiz dynamiques et suivez vos progrès pour optimiser vos sessions d'apprentissage.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                <div className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Questions adaptatives
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Feedback instantané
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Suivi des progrès
                </div>
              </div>
            </div>

            {/* Révision Éclair - Rectangle carré */}
            <div className="md:col-span-2 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Révision Éclair
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sessions de 5-15 minutes pour maximiser votre mémorisation.
              </p>
            </div>

            {/* Statistiques - Rectangle carré */}
            <div className="md:col-span-2 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Statistiques
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analyses détaillées de vos progrès et domaines à améliorer.
              </p>
            </div>

            {/* Étude Collaborative - Rectangle large horizontal */}
            <div className="md:col-span-4 lg:col-span-8 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Étude Collaborative
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Partagez vos quiz avec vos amis, créez des groupes d'étude et challengez-vous mutuellement pour rester motivés.
              </p>
            </div>

            {/* IA Adaptive - Rectangle carré */}
            <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                IA Adaptive
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                S'adapte à votre rythme et identifie vos lacunes personnalisées.
              </p>
            </div>

            {/* Mode Hors-ligne - Rectangle carré */}
            <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mode Hors-ligne
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuez à étudier sans connexion avec synchronisation automatique.
              </p>
            </div>

            {/* Objectifs & Badges - Rectangle carré */}
            <div className="md:col-span-3 lg:col-span-4 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h3a1 1 0 011 1v2h4a1 1 0 011 1v3a1 1 0 01-1 1h-2v9a2 2 0 01-2 2H8a2 2 0 01-2-2V9H4a1 1 0 01-1-1V5a1 1 0 011-1h3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Objectifs & Badges
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Définissez vos objectifs d'apprentissage et débloquez des badges pour rester motivé.
              </p>
            </div>

            {/* Création Assistée - Rectangle large horizontal */}
            <div className="md:col-span-4 lg:col-span-6 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Création Assistée par IA
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Importez vos cours et laissez l'IA générer automatiquement des questions pertinentes.
              </p>
            </div>

            {/* Sons & Ambiances - Rectangle carré */}
            <div className="md:col-span-2 lg:col-span-6 text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sons & Ambiances
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Personnalisez votre environnement d'étude avec des ambiances relaxantes.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center mt-32 py-20 px-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à révolutionner 
            <br />
            vos révisions ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui ont déjà optimisé leur apprentissage avec Optima.
          </p>
          <Link href="/signup" className="px-10 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-50 transition-all duration-300 hover:scale-105 text-lg font-semibold shadow-lg">
            Commencer maintenant
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Optima
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            L'avenir de l'apprentissage intelligent.
          </p>
        </div>
      </footer>
    </div>
  );
}
