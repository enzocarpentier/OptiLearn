'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { decks as supabaseDecks, Deck } from '@/lib/supabase';
import DeckCard from './DeckCard';

interface DecksViewProps {
  onDeckClick: (deck: Deck) => void;
}

// Fonction pour convertir les dates de Supabase en format local
function formatDeckForDisplay(deck: Deck): Deck & { createdAt: Date; modifiedAt: Date } {
  return {
    ...deck,
    createdAt: new Date(deck.created_at),
    modifiedAt: new Date(deck.modified_at),
  };
}

export default function DecksView({ onDeckClick }: DecksViewProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { currentUser } = useAuth();

  const handleDeckDeleted = (deckId: string) => {
    console.log('handleDeckDeleted appelé avec deckId:', deckId);
    console.log('Decks avant suppression:', decks.map(d => ({ id: d.id, name: d.name })));
    setDecks(prev => {
      const newDecks = prev.filter(deck => deck.id !== deckId);
      console.log('Decks après suppression:', newDecks.map(d => ({ id: d.id, name: d.name })));
      return newDecks;
    });
  };

  const handleDeckUpdated = (updatedDeck: Deck) => {
    setDecks(prev => prev.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
  };

  // Charger les decks depuis Supabase
  useEffect(() => {
    const loadDecks = async () => {
      if (!currentUser) {
        setDecks([]);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const userDecks = await supabaseDecks.getDecks(currentUser.id);
        setDecks(userDecks);
      } catch (err) {
        console.error('Erreur lors du chargement des decks:', err);
        setError('Erreur lors du chargement des decks');
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [currentUser]);

  // Écouteur d'événement pour ouvrir la modale de création de deck
  useEffect(() => {
    const handleOpenCreateModal = () => {
      setShowCreateModal(true);
    };
    
    window.addEventListener('openCreateDeckModal', handleOpenCreateModal);
    
    return () => {
      window.removeEventListener('openCreateDeckModal', handleOpenCreateModal);
    };
  }, []);

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim() || !currentUser) return;

    // Vérifier qu'un PDF est sélectionné
    if (!selectedFile) {
      setError('Un fichier PDF est requis pour créer un deck');
      return;
    }

    setCreateLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Vérifier que c'est bien un PDF
      if (selectedFile.type !== 'application/pdf') {
        throw new Error('Seuls les fichiers PDF sont acceptés');
      }

      // Vérifier la taille du fichier (max 10 MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux (max 10 MB)');
      }

      setUploadProgress(25);

      // Créer le deck d'abord
      const newDeck = await supabaseDecks.createDeck({
        type: 'deck',
        name: newDeckName.trim(),
        status: 'not_started',
        user_id: currentUser.id,
        parent_id: null,
      });

      setUploadProgress(50);
      
      // Uploader le PDF
      const filePath = await supabaseDecks.uploadPDF(newDeck.id, selectedFile, currentUser.id);
      
      setUploadProgress(75);
      
      // Mettre à jour l'état local avec le nouveau deck complet
      const updatedDeck = {
        ...newDeck,
        pdf_file_path: filePath,
        pdf_file_name: selectedFile.name,
        pdf_file_size: selectedFile.size,
        pdf_upload_date: new Date().toISOString(),
        modified_at: new Date().toISOString(),
      };

      setDecks(prev => [updatedDeck, ...prev]);
      
      setUploadProgress(100);

      setNewDeckName('');
      setSelectedFile(null);
      setShowCreateModal(false);
      setUploadProgress(0);
    } catch (err) {
      console.error('Erreur lors de la création du deck:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du deck');
      setUploadProgress(0);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <div className="max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec effet de verre */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Mes Decks
              </h1>
              <p className="text-slate-600 mt-2">
                Gérez vos collections de cartes d'apprentissage
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un nouveau deck
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

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
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Aucun deck créé pour le moment
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Créez votre premier deck en ajoutant un document PDF pour commencer à organiser vos sessions d'apprentissage
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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



        {/* Modal de création avec design moderne */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header du modal */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Créer un nouveau deck</h3>
                <p className="text-blue-100">Donnez un nom à votre collection et ajoutez un document PDF pour commencer</p>
              </div>

              {/* Contenu du modal */}
              <form onSubmit={handleCreateDeck} className="p-6">
                <div className="mb-6">
                  <label htmlFor="deckName" className="block text-sm font-semibold text-slate-700 mb-3">
                    Nom du deck
                  </label>
                  <input
                    type="text"
                    id="deckName"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500"
                    placeholder="Ex: Cours de mathématiques"
                    required
                  />
                </div>

                {/* Upload de PDF */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Document PDF <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    selectedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-slate-300 hover:border-blue-400'
                  }`}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="pdfFile"
                      required
                    />
                    <label
                      htmlFor="pdfFile"
                      className="cursor-pointer block"
                    >
                      {selectedFile ? (
                        <div className="text-green-600">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      ) : (
                        <div className="text-slate-500">
                          <svg className="w-8 h-8 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm font-medium">Cliquez pour sélectionner un PDF</p>
                          <p className="text-xs text-red-500 mt-1">Fichier requis • Taille max: 10 MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                      Supprimer le fichier
                    </button>
                  )}
                </div>

                {/* Barre de progression */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Upload en cours...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-800 font-medium">{error}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setError(null);
                      setSelectedFile(null);
                      setUploadProgress(0);
                    }}
                    className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-semibold transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading || !selectedFile}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {createLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Upload...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {!selectedFile && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        )}
                        {selectedFile ? 'Créer le deck' : 'Sélectionnez un PDF'}
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 