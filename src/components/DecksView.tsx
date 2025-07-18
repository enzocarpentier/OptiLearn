'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { decks as supabaseDecks, Deck } from '@/lib/supabase';
import DeckCard from './DeckCard';

interface DecksViewProps {
  initialDecks: Deck[];
  isLoading: boolean;
  onDeckClick: (deck: Deck) => void;
  onDeckDeleted: (deckId: string) => void;
  onDeckUpdated: (deck: Deck) => void;
  onOpenCreateDeckModal: () => void;
}

// Fonction pour convertir les dates de Supabase en format local
function formatDeckForDisplay(deck: Deck): Deck & { createdAt: Date; modifiedAt: Date } {
  return {
    ...deck,
    createdAt: new Date(deck.created_at),
    modifiedAt: new Date(deck.modified_at),
  };
}

export default function DecksView({
  initialDecks,
  isLoading,
  onDeckClick,
  onDeckDeleted,
  onDeckUpdated,
  onOpenCreateDeckModal,
}: DecksViewProps) {
  // --- Unified header block (like Dashboard/Settings) ---
  // Place this at the top of the main content render
  // ---
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [loading, setLoading] = useState(isLoading);

  const { currentUser } = useAuth();

  useEffect(() => {
    setDecks(initialDecks);
  }, [initialDecks]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handleDeckDeleted = (deckId: string) => {
    onDeckDeleted(deckId);
  };

  const handleDeckUpdated = (updatedDeck: Deck) => {
    onDeckUpdated(updatedDeck);
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Deck['status']) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
      case 'not_started': return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Deck['status']) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'not_started': return 'Non commencé';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mb-8">
        <div className="w-fit max-w-full">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Mes Decks
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Gérez vos collections de cartes d'apprentissage
          </p>
        </div>
        <button
          onClick={onOpenCreateDeckModal}
          className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer votre premier deck
          </div>
        </button>
      </div>



      {/* Liste des decks */}
      {decks.length === 0 ? (
        <div className="text-center py-20">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Aucun deck créé pour le moment
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Créez votre premier deck en ajoutant un document PDF pour commencer à organiser vos sessions d'apprentissage
          </p>
          <button
            onClick={onOpenCreateDeckModal}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer votre premier deck
            </div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
          {decks.map((deck, index) => (
            <DeckCard 
              key={deck.id} 
              deck={deck} 
              onDeckClick={onDeckClick} 
              onDeckDeleted={handleDeckDeleted} 
              onDeckUpdated={handleDeckUpdated}
              index={index} 
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .deck-card-enter {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 