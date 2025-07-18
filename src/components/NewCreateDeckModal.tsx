'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { decks, Deck } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud } from 'lucide-react';
import { BarLoader } from 'react-spinners';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckCreated: (deck: Deck) => void;
}

const NewCreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose, onDeckCreated }) => {
  const { currentUser } = useAuth();
  const [deckName, setDeckName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        if (acceptedFiles[0].size > 10 * 1024 * 1024) { // 10 MB
          setError('Le fichier est trop volumineux. La taille maximale est de 10 MB.');
          setFile(null);
        } else {
          setFile(acceptedFiles[0]);
          setError(null);
        }
      }
    },
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !deckName.trim() || !currentUser) {
      setError('Le nom du deck et le fichier PDF sont requis.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Appeler la nouvelle fonction atomique pour créer le deck et uploader le PDF
      const newDeck = await decks.createDeckWithPDF(
        {
          type: 'deck',
          name: deckName.trim(),
          status: 'not_started',
          user_id: currentUser.id,
          parent_id: null,
        },
        file,
        currentUser.id
      );

      // Si tout réussit, la fonction retourne le deck complet
      onDeckCreated(newDeck);
      onClose();
      setDeckName('');
      setFile(null);

    } catch (err) {
      console.error('Erreur lors de la création du deck avec PDF:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Créer un nouveau deck</h3>
          <p className="text-blue-100">Donnez un nom à votre collection et ajoutez un document PDF pour commencer</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="deckName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nom du deck</label>
            <input
              type="text"
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Ex: Cours de mathématiques"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Document PDF <span className="text-red-500">*</span></label>
            <div 
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50'}`}>
              <input {...getInputProps()} />
              <div className="text-slate-500 dark:text-slate-400">
                {file ? (
                  <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud size={32} className="mb-2 text-slate-400 dark:text-slate-500" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Cliquez pour sélectionner un PDF</p>
                    <p className="text-xs">ou glissez-déposez-le ici</p>
                    <p className="text-xs mt-2 text-slate-400 dark:text-slate-500">Fichier requis • Taille max: 10 MB</p>
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <div className="mt-2 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
              Annuler
            </button>
            <button 
              type="submit"
              disabled={!deckName || !file || isLoading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? <BarLoader color="#ffffff" height={4} width={30} /> : 'Créer le deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCreateDeckModal;
