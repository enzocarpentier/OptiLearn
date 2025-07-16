'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import CreateDeckModal from '@/components/CreateDeckModal';
import DecksView from '@/components/DecksView';
import DeckDetailView from '@/components/DeckDetailView';
import { decks } from '@/lib/supabase';

// --- View Components ---

const DashboardHomeView = ({ onOpenCreateDeckModal }: { onOpenCreateDeckModal: () => void }) => {
  const { currentUser } = useAuth();
  const [deckCount, setDeckCount] = useState(0);

  useEffect(() => {
    const fetchDeckCount = async () => {
      if (currentUser) {
        try {
          const userDecks = await decks.getDecks(currentUser.id);
          setDeckCount(userDecks.length);
        } catch (error) {
          console.error('Erreur lors de la récupération des decks:', error);
        }
      }
    };

    fetchDeckCount();
  }, [currentUser]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    {/* Header avec effet de verre */}
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-slate-600 mt-2">
            Gérez vos sessions d'apprentissage et suivez vos progrès grâce à l'intelligence artificielle.
          </p>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-8 py-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-slate-600">Decks créés</p>
              <p className="text-2xl font-bold text-slate-900">{deckCount}</p>
            </div>
        </div>
      </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-slate-600">Quiz Complétés</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-slate-600">Temps d'étude</p>
              <p className="text-2xl font-bold text-slate-900">0h</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-slate-600">Score Moyen</p>
              <p className="text-2xl font-bold text-slate-900">-%</p>
            </div>
          </div>
        </div>
    </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Upload de PDF */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Créer un Deck
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Téléchargez un document pour créer un nouveau deck de révision.
          </p>
          <button 
            onClick={onOpenCreateDeckModal}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Créer un nouveau deck
          </button>
        </div>

        {/* Quiz Rapide */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
              Bientôt disponible
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Quiz Rapide
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Démarrez un quiz rapide pour réviser vos derniers cours.
          </p>
          <button 
            disabled
            className="w-full px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-semibold cursor-not-allowed"
          >
            Commencer un quiz
          </button>
        </div>

        {/* Révision Intelligente */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
              Bientôt disponible
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            IA Adaptative
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            L'IA s'adapte à votre niveau et identifie vos lacunes.
          </p>
          <button 
            disabled
            className="w-full px-4 py-2 bg-slate-100 text-slate-400 rounded-xl font-semibold cursor-not-allowed"
          >
            Révision personnalisée
          </button>
        </div>
      </div>

      {/* Recent Activity - Empty State */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Activité Récente</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
            Bientôt disponible
          </span>
        </div>
        <div className="text-center py-12">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Fonctionnalité en développement</h3>
          <p className="text-slate-600">Le suivi d'activité sera bientôt disponible dans une prochaine mise à jour.</p>
        </div>
      </div>
    </div>
  </div>
  );
};

const PlaceholderView = ({ title }: { title: string }) => {
  const getIcon = (title: string) => {
    switch (title) {
      case 'Quiz':
        return (
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Statistiques':
        return (
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'Paramètres':
        return (
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const getGradient = (title: string) => {
    switch (title) {
      case 'Quiz':
        return 'from-green-500 to-emerald-600';
      case 'Statistiques':
        return 'from-purple-500 to-indigo-600';
      case 'Paramètres':
        return 'from-gray-500 to-slate-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const getDescription = (title: string) => {
    switch (title) {
      case 'Quiz':
        return 'Bientôt disponible : testez vos connaissances avec des quiz interactifs et personnalisés.';
      case 'Statistiques':
        return 'Bientôt disponible : suivez vos progrès et analysez vos performances d\'apprentissage.';
      case 'Paramètres':
        return 'Bientôt disponible : personnalisez votre expérience et gérez vos préférences.';
      default:
        return 'Cette fonctionnalité sera bientôt disponible.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec effet de verre */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-600 mt-2">
              {getDescription(title)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center">
          {/* Icône animée */}
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
            <div className={`absolute inset-4 bg-gradient-to-r ${getGradient(title)} rounded-full flex items-center justify-center shadow-lg`}>
              {getIcon(title)}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Cette page est en construction
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {getDescription(title)}
            </p>

            {/* Badge "Bientôt disponible" */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full font-semibold border border-amber-200 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bientôt disponible
            </div>

            {/* Fonctionnalités à venir */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {title === 'Quiz' && (
                <>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Quiz Rapides</h3>
                    <p className="text-sm text-slate-600">Sessions de révision de 5-15 minutes</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">IA Adaptative</h3>
                    <p className="text-sm text-slate-600">Questions personnalisées selon votre niveau</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Mode Multijoueur</h3>
                    <p className="text-sm text-slate-600">Défiez vos amis et classements</p>
                  </div>
                </>
              )}
              
              {title === 'Statistiques' && (
                <>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Analyses Détaillées</h3>
                    <p className="text-sm text-slate-600">Graphiques de progression et performances</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Temps d'Étude</h3>
                    <p className="text-sm text-slate-600">Suivi du temps passé par matière</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Points Forts/Faibles</h3>
                    <p className="text-sm text-slate-600">Identification des domaines à améliorer</p>
                  </div>
                </>
              )}
              
              {title === 'Paramètres' && (
                <>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Profil Utilisateur</h3>
                    <p className="text-sm text-slate-600">Gestion de vos informations personnelles</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12a1 1 0 011-1h2a1 1 0 011 1v12z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Préférences</h3>
                    <p className="text-sm text-slate-600">Notifications, thème et langue</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Sécurité</h3>
                    <p className="text-sm text-slate-600">Mot de passe et authentification</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeckDetailViewOpen, setIsDeckDetailViewOpen] = useState(false);
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('Tableau de bord');
  const [selectedDeck, setSelectedDeck] = useState<any | null>(null);

  // Hide the global header for dashboard
  useEffect(() => {
    const header = document.querySelector('header') as HTMLElement;
    const main = document.querySelector('body > div > main') as HTMLElement;
    if (header) header.style.display = 'none';
    if (main) {
      main.style.paddingTop = '0';
      main.style.height = '100vh';
      main.style.overflow = 'hidden';
    }

    // Écouteur d'événement pour la navigation vers Mes Decks avec ouverture de la modale
    const handleNavigateToDecks = (event: CustomEvent) => {
      setActiveView('Mes Decks');
      if (event.detail?.openCreateModal) {
        setTimeout(() => setIsCreateDeckModalOpen(true), 100); // Petit délai pour s'assurer que la vue est chargée
      }
    };

    window.addEventListener('navigateToDecks', handleNavigateToDecks as EventListener);

    return () => {
      if (header) header.style.display = '';
      if (main) {
        main.style.paddingTop = '';
        main.style.height = '';
        main.style.overflow = '';
      }
      window.removeEventListener('navigateToDecks', handleNavigateToDecks as EventListener);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Forcer la redirection vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navigateToView = (viewName: string) => {
    setActiveView(viewName);
    // Ne pas utiliser setCurrentDeck qui n'est pas défini
  };

  const handleSelectDeck = (deck: any) => {
    setSelectedDeck(deck);
    setIsDeckDetailViewOpen(true);
    setActiveView('DeckDetail'); // Changer la vue active pour afficher le détail du deck
  };

  const handleCloseDeckDetail = () => {
    setIsDeckDetailViewOpen(false);
    setSelectedDeck(null);
  };

  const sidebarItems = [
    {
      name: 'Tableau de bord',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4M8 12a2 2 0 012-2h4a2 2 0 012 2v4" />
        </svg>
      ),
    },
    {
      name: 'Mes Decks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Quiz',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Statistiques',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Paramètres',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    }
  ];

  // Fonction pour naviguer vers Mes Decks et ouvrir la modale de création
  const navigateToDecksAndCreate = () => {
    setActiveView('Mes Decks');
    // Utiliser un événement personnalisé pour ouvrir la modale dans DecksView
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openCreateDeckModal'));
    }, 100);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Tableau de bord':
        return <DashboardHomeView onOpenCreateDeckModal={navigateToDecksAndCreate} />;
      case 'Mes Decks':
        return <DecksView onDeckClick={handleSelectDeck} />;
      case 'DeckDetail':
        return selectedDeck ? <DeckDetailView deck={selectedDeck} onBack={() => navigateToView('Mes Decks')} /> : <DashboardHomeView onOpenCreateDeckModal={() => setIsCreateDeckModalOpen(true)} />;
      case 'Quiz':
        return <PlaceholderView title="Quiz" />;
      case 'Statistiques':
        return <PlaceholderView title="Statistiques" />;
      case 'Paramètres':
        return <PlaceholderView title="Paramètres" />;
      default:
        return <DashboardHomeView />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100 overflow-hidden dashboard-layout">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200 relative">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                OptiLearn
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>



          {/* Navigation */}
          <nav className="mt-8 px-4">
            <div className="space-y-3">
              {sidebarItems.map((item) => {
                // Consider "Mes Decks" as active when in DeckDetail view
                const isActive = activeView === item.name || 
                  (item.name === 'Mes Decks' && activeView === 'DeckDetail');
                
                return (
                  <button
                    key={item.name}
                    onClick={() => navigateToView(item.name)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ease-in-out group ${
                      isActive
                        ? 'bg-primary-50'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`mr-4 transition-colors duration-200 ${isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-600'}`}>{item.icon}</div>
                    <span className={`font-semibold transition-colors duration-200 ${isActive ? 'text-primary-700' : 'text-gray-600 group-hover:text-gray-700'}`}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              OptiLearn
            </div>
            <div className="w-8"></div> {/* Spacer */}
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Le DeckDetailView est maintenant géré via activeView et renderContent */}

      <CreateDeckModal 
        isOpen={isCreateDeckModalOpen} 
        onClose={() => setIsCreateDeckModalOpen(false)} 
      />
    </ProtectedRoute>
  );
}