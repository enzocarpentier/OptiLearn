'use client';

import { useState, Fragment } from 'react';
import { Deck, decks as supabaseDecks } from '@/lib/supabase';
import { Menu, Dialog, Transition } from '@headlessui/react';

interface DeckCardProps {
  deck: Deck;
  onDeckClick: (deck: Deck) => void;
  onDeckDeleted: (deckId: string) => void;
  onDeckUpdated: (deck: Deck) => void;
  index: number;
}

export default function DeckCard({ deck, onDeckClick, onDeckDeleted, onDeckUpdated, index }: DeckCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDeckName, setNewDeckName] = useState(deck.name);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRenameClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNewDeckName(deck.name);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNewDeckName(deck.name);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(false);
    setNewDeckName(deck.name);
  };

  const handleSaveRename = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!newDeckName.trim() || newDeckName.trim() === deck.name) {
      setIsEditing(false);
      return;
    }
    try {
      const updatedDeck = await supabaseDecks.updateDeck(deck.id, { name: newDeckName.trim() });
      onDeckUpdated(updatedDeck);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors du renommage du deck:', error);
      alert('Une erreur est survenue lors du renommage.');
    }
  };

  const openConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const confirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('confirmDelete: suppression du deck', deck.id);

    

      console.log('Confirmation reçue, suppression en cours...');
      try {
        console.log('Appel à supabaseDecks.deleteDeck avec ID:', deck.id);
        await supabaseDecks.deleteDeck(deck.id);
        console.log('supabaseDecks.deleteDeck terminé avec succès');
        
        console.log('Appel à onDeckDeleted avec ID:', deck.id);
        onDeckDeleted(deck.id);
        console.log('onDeckDeleted appelé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression du deck:', error);
        alert('Une erreur est survenue lors de la suppression : ' + (error as Error).message);
      }
    setIsConfirmOpen(false);
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

  if (isEditing) {
    return (
      <div
        className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg dark:shadow-2xl dark:shadow-blue-500/10 transition-all duration-300 overflow-hidden p-6"
        style={{
          animationName: 'fadeInUp',
          animationDuration: '0.6s',
          animationTimingFunction: 'ease-out',
          animationFillMode: 'forwards',
          animationDelay: `${index * 100}ms`
        }}
      >
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Renommer le deck</h3>
        <input
          type="text"
          value={newDeckName}
          onChange={(e) => setNewDeckName(e.target.value)}
          className="w-full px-4 py-3 bg-white/70 dark:bg-slate-700/50 border border-slate-300/50 dark:border-slate-600 rounded-lg text-lg font-medium text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:bg-white/90 dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          placeholder="Nouveau nom du deck"
          autoFocus
          onClick={(e) => e.stopPropagation()} // Empêche le clic de se propager
        />
        <div className="mt-4 flex justify-end gap-3">
          <button 
            onClick={handleCancelEdit}
            className="font-semibold text-slate-600 dark:text-slate-300 py-2 px-5 rounded-full hover:bg-slate-500/10 dark:hover:bg-slate-700/50 transition-colors duration-300"
          >
            Annuler
          </button>
          <button 
            onClick={handleSaveRename} 
            className="font-bold text-white py-2 px-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:from-slate-400 disabled:to-slate-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
            disabled={!newDeckName.trim() || newDeckName.trim() === deck.name}
          >
            Enregistrer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/10 transition-all duration-300 ease-out border border-slate-200/80 dark:border-slate-800 transform motion-safe:hover:scale-[1.02] motion-safe:hover:-translate-y-1`}
      style={{
        animationName: 'fadeInUp',
        animationDuration: '0.6s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="relative z-10 p-6 cursor-pointer" onClick={() => onDeckClick(deck)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2"
              title={deck.name}
            >
              {deck.name}
            </h3>
          </div>

          {/* Menu d'options */}
          <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button 
                className="flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-slate-900 rounded-lg shadow-xl z-20 border border-gray-200 dark:border-slate-700 focus:outline-none">
              <Menu.Item>
                {({ active }: { active: boolean }) => (
                  <button
                    onClick={handleRenameClick}
                    className={`${active ? 'bg-gray-100 dark:bg-slate-800' : ''} block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-400 rounded-t-lg`}
                  >
                    Renommer
                  </button>
                )}
              </Menu.Item>
              <div className="border-t border-gray-100 dark:border-slate-700"></div>
              <Menu.Item>
                {({ active }: { active: boolean }) => (
                  <button
                    onClick={openConfirm}
                    className={`${active ? 'bg-red-50 dark:bg-red-900' : ''} block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 rounded-b-lg`}
                  >
                    Supprimer
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        {/* Modal de confirmation de suppression */}
        <Transition appear show={isConfirmOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsConfirmOpen(false)}>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30 dark:bg-black/60" aria-hidden="true" />
              </Transition.Child>

              {/* Trick the browser into centering the modal */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-900 shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-slate-100">
                    Supprimer le deck
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Êtes-vous sûr de vouloir supprimer le deck « {deck.name} » ? Cette action est irréversible.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-400 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-transparent rounded-md hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400"
                      onClick={confirmDelete}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        
        <div className="space-y-3">
          {deck.pdf_file_name && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium line-clamp-2" title={deck.pdf_file_name}>{deck.pdf_file_name || 'Fichier PDF'}</span>
              <span className="text-xs text-green-500 dark:text-green-600 ml-auto">
                {deck.pdf_file_size && formatFileSize(deck.pdf_file_size)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Créé le {formatDate(deck.created_at)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifié le {formatDate(deck.modified_at)}
          </div>
        </div>
      </div>




    </div>
  );
}
