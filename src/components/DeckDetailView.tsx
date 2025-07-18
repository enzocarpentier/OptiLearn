'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Deck, decks as supabaseDecks } from '@/lib/supabase';
import AIAssistant from './AIAssistant';
import TwoColumnLayout from './TwoColumnLayout';
import CustomPDFViewer from './CustomPDFViewer';

interface DeckDetailViewProps {
  deck: Deck;
  onBack: () => void;
}



export default function DeckDetailView({ deck, onBack }: DeckDetailViewProps) {
  const { currentUser } = useAuth();

  // --- PDF Logic --- 
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (!deck.pdf_file_path) {
        setPdfUrl(null);
        return;
      }
      setLoadingPdf(true);
      setPdfError(null);
      try {
        const signedUrl = await supabaseDecks.getSignedPDFUrl(deck.pdf_file_path);
        setPdfUrl(signedUrl);
      } catch (err) {
        console.error('Erreur lors du chargement du PDF:', err);
        setPdfError('Impossible de charger le PDF');
      } finally {
        setLoadingPdf(false);
      }
    };
    loadPDF();
  }, [deck.pdf_file_path]);

  const handleUploadPDF = async (file: File) => {
    if (!currentUser) return;
    setLoadingPdf(true);
    setPdfError(null);
    try {
      if (file.type !== 'application/pdf') throw new Error('Seuls les fichiers PDF sont acceptés');
      if (file.size > 10 * 1024 * 1024) throw new Error('Le fichier est trop volumineux (max 10 MB)');
      const updatedDeck = await supabaseDecks.uploadPDF(deck.id, file, currentUser.id);
      if (updatedDeck.pdf_file_path) {
        const signedUrl = await supabaseDecks.getSignedPDFUrl(updatedDeck.pdf_file_path);
        setPdfUrl(signedUrl);
      }
      window.location.reload(); // Recharger pour voir les changements
    } catch (err) {
      console.error(`Erreur lors de l'upload du PDF:`, err);
      setPdfError(err instanceof Error ? err.message : `Erreur lors de l'upload du PDF`);
    } finally {
      setLoadingPdf(false);
    }
  };

  // --- AI Assistant --- 
  const deckForAI = {
    id: deck.id,
    name: deck.name,
    fileName: deck.pdf_file_name || deck.name,
  };
  const aiAssistant = <AIAssistant deck={deckForAI} />;

  // --- Main Content (PDF Viewer) --- 
  let mainContent;
  if (loadingPdf) {
    mainContent = (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
      </div>
    );
  } else if (pdfError) {
    mainContent = (
      <div className="bg-white rounded-lg border border-red-200 p-8 text-center h-full flex items-center justify-center">
        <p className="text-red-800 font-medium">{pdfError}</p>
      </div>
    );
  } else if (pdfUrl) {
    mainContent = <CustomPDFViewer pdfUrl={pdfUrl} fileName={deck.pdf_file_name} />;
  } else {
    mainContent = (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="text-gray-500 mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun PDF associé</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors mt-4">
            <input type="file" accept=".pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUploadPDF(file); }} className="hidden" id="uploadPDF" />
            <label htmlFor="uploadPDF" className="cursor-pointer block text-blue-600 hover:text-blue-800 font-medium">Cliquez pour sélectionner un PDF</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header de la page */}
      <div className="h-20 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0 px-6">
        <div>
          <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Retour aux decks
          </button>
          <h1 className="text-xl font-bold text-gray-900 mt-1 truncate" title={deck.name}>{deck.name}</h1>
        </div>
        {/* La date de modification a été supprimée */}
      </div>

      {/* Layout principal */}
      <TwoColumnLayout mainContent={mainContent} rightSidebar={aiAssistant} />
    </div>
  );
} 