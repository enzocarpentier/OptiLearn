'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Redirige vers la page publique si l'utilisateur n'est pas authentifié
type RedirectPath = '/decouverte';
import ProtectedRoute from '@/components/ProtectedRoute';
import NewCreateDeckModal from '@/components/NewCreateDeckModal';
import Sidebar from '@/components/Sidebar';
import DecksView from '@/components/DecksView';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-slate-500 dark:text-slate-400">Chargement du lecteur PDF...</p>
    </div>
  ),
});
import { BarLoader } from 'react-spinners';
import { supabase } from '@/lib/supabase';
import { ProfileSettingsView } from './ProfileSettingsView';
import { PasswordSettingsView } from './PasswordSettingsView';
import { AppearanceSettingsView } from './AppearanceSettingsView';
import { DangerZoneView } from './DangerZoneView';
import { Deck, decks } from '@/lib/supabase';
import AIAssistant from '@/components/AIAssistant';
import ComingSoonPanel from '@/components/ComingSoonPanel';
import { DeckTabId } from '@/components/DeckTabs';

/* -------------------------------------------------------------------------- */
/*                              Redirection protection                        */
/* -------------------------------------------------------------------------- */



const DashboardHomeView = ({ onOpenCreateDeckModal, deckCount }: { onOpenCreateDeckModal: () => void; deckCount: number }) => {


  return (
    <div className="w-full h-full p-8">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Tableau de bord
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Bienvenue ! Gérez vos decks et suivez vos progrès</p>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Deck count */}
        <StatCard iconColor="blue" title="Decks créés" value={deckCount.toString()} svgPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        {/* Quiz completed */}
        <StatCard iconColor="green" title="Quiz créés" value="0" svgPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        {/* Study time */}
        <StatCard iconColor="orange" title="Temps d'étude" value="0h" svgPath="M13 10V3L4 14h7v7l9-11h-7z" />
        {/* Avg score */}
        <StatCard iconColor="indigo" title="Score moyen" value="-%" svgPath="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ShortcutCard
          color="blue"
          title="Créer un deck"
          subtitle="Organisez vos cartes d'apprentissage"
          onClick={onOpenCreateDeckModal}
        />
        <ShortcutCard
          color="green"
          title="Commencer un quiz"
          subtitle="Testez vos connaissances"
          disabled
        />
        <ShortcutCard
          color="indigo"
          title="Voir les statistiques"
          subtitle="Analysez vos performances"
          disabled
        />
      </div>

      {/* Recent Activity Section */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/40 overflow-hidden border border-slate-200/80 dark:border-slate-800/30 shadow-md opacity-60">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Activité récente</h2>
          <div className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-amber-900/50 dark:text-amber-300">
            Bientôt disponible
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center mb-6 mx-auto shadow-md">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Aucune activité récente</h3>
          <p className="text-slate-500 dark:text-slate-400">Vos dernières actions apparaîtront ici.</p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- Quiz/Stats ------------------------------- */
const PlaceholderView = ({ title }: { title: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-8">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100">
      {title}
    </h1>
    <p className="text-slate-600 dark:text-slate-400">Cette fonctionnalité sera disponible prochainement.</p>
  </div>
);
const QuizView = () => <PlaceholderView title="Quiz" />;
const StatsView = () => <PlaceholderView title="Statistiques" />;

/* ----------------------------- DeckDetailView --------------------------- */
const DeckDetailView = ({ deck, onBack, onDeckDeleted, onDeckUpdated, pdfUrl }: { deck: Deck; onBack: () => void; onDeckDeleted: (deckId: string) => void; onDeckUpdated: (deck: Deck) => void; pdfUrl: string | null; }) => {
  const isFeatureDisabled = false; // AI Assistant re-enabled

  // Menu interne du deck (Assistant IA, Quiz, Résumé, Flashcard)
  const [activeMenu, setActiveMenu] = useState<DeckTabId>('assistant');

  // Rendu conditionnel du panneau latéral selon le menu sélectionné
  const renderRightPanel = () => {
    switch (activeMenu) {
      case 'assistant':
        return isFeatureDisabled ? (
          <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center rounded-b-xl z-10">
            <div className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full dark:bg-amber-900/50 dark:text-amber-300">
              Bientôt disponible
            </div>
          </div>
        ) : (
          <AIAssistant deck={deck} pdfUrl={pdfUrl} activeTab={activeMenu} onTabSelect={(id) => setActiveMenu(id)} />
        );
      case 'quiz':
        return <ComingSoonPanel label="Quiz" activeTab={activeMenu} onTabSelect={(id) => setActiveMenu(id)} />;
      case 'resume':
        return <ComingSoonPanel label="Résumé" activeTab={activeMenu} onTabSelect={(id) => setActiveMenu(id)} />;
      case 'flashcard':
        return <ComingSoonPanel label="Flashcard" activeTab={activeMenu} onTabSelect={(id) => setActiveMenu(id)} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header section */}
      <div className="flex-shrink-0 flex items-center gap-4 p-3 border-b border-slate-200 dark:border-slate-800">
        {/* Back button */}
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Retour</span>
        </button>

        {/* Deck Title */}
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{deck.name}</h1>
          {deck.pdf_file_name && (
            <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{deck.pdf_file_name}</p>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0 p-4">
        {/* PDF Viewer */}
        <div className="lg:col-span-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden">
          {pdfUrl ? (
            <PdfViewer fileUrl={pdfUrl} />
          ) : (
            <p className="text-slate-500 dark:text-slate-400">Ce deck n'a pas de PDF associé.</p>
          )}
        </div>

        {/* Panneau latéral en fonction du menu sélectionné */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Settings view ----------------------------- */
const SettingsView = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'danger'>('profile');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: '👤' },
    { id: 'security', name: 'Sécurité', icon: '🔒' },
    { id: 'appearance', name: 'Apparence', icon: '🎨' },
    { id: 'danger', name: 'Danger', icon: '⚠️' },
  ] as const;

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettingsView user={currentUser} logout={logout} />;
      case 'security':
        return <PasswordSettingsView />;
      case 'appearance':
        return <AppearanceSettingsView />;
      case 'danger':
        return <DangerZoneView />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full p-8">
      <div className="flex flex-col w-fit max-w-full mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Paramètres
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Gérez vos informations et personnalisez votre expérience.</p>
      </div>
      
      {/* Horizontal Tabs nav */}
      <nav className="flex flex-row gap-1 w-max mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            <span className="mr-2 text-lg">{t.icon}</span>
            {t.name}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        {renderTab()}
      </div>
    </div>
  );
};

/* ----------------------------- Helper components --------------------------- */
interface StatCardProps {
  title: string;
  value: string;
  iconColor: 'blue' | 'green' | 'orange' | 'indigo';
  svgPath: string;
}
const StatCard = ({ title, value, iconColor, svgPath }: StatCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/40',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconText: 'text-white',
    },
    green: {
      bg: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/40',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      iconText: 'text-white',
    },
    orange: {
      bg: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/40',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      iconText: 'text-white',
    },
    indigo: {
      bg: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/40',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      iconText: 'text-white',
    },
  };

  const classes = colorClasses[iconColor];

  return (
    <div
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${classes.bg} overflow-hidden border border-slate-200/80 dark:border-slate-800/30 shadow-md`}
    >
      <div className={`w-14 h-14 ${classes.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
        <svg className={`w-7 h-7 ${classes.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
        </svg>
      </div>
      <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</p>
    </div>
  );
};
interface ShortcutCardProps {
  title: string;
  subtitle: string;
  color: 'blue' | 'green' | 'indigo';
  onClick?: () => void;
  disabled?: boolean;
}
const ShortcutCard = ({ title, subtitle, color, onClick, disabled }: ShortcutCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/40',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconText: 'text-white',
      glow: 'hover:shadow-blue-500/20',
    },
    green: {
      bg: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/40',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      iconText: 'text-white',
      glow: 'hover:shadow-green-500/20',
    },
    indigo: {
      bg: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/40',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      iconText: 'text-white',
      glow: 'hover:shadow-indigo-500/20',
    },
  };

  const classes = colorClasses[color];

  if (disabled) {
    return (
      <div
        aria-disabled={true}
        className={`group relative text-left p-6 rounded-2xl bg-gradient-to-br ${classes.bg} overflow-hidden opacity-60 cursor-not-allowed`}
      >
        <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-amber-900/50 dark:text-amber-300">
          Bientôt disponible
        </div>
        <div className={`w-14 h-14 ${classes.iconBg} rounded-xl flex items-center justify-center mb-5 shadow-md`}>
          <svg className={`w-7 h-7 ${classes.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{subtitle}</p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`group relative text-left p-6 rounded-2xl bg-gradient-to-br ${classes.bg} overflow-hidden transition-all duration-300 ease-out transform hover:-translate-y-1 border border-slate-200/80 dark:border-slate-800/30 shadow-md hover:shadow-xl ${classes.glow}`}
    >
      <div className={`w-14 h-14 ${classes.iconBg} rounded-xl flex items-center justify-center mb-5 shadow-md`}>
        <svg className={`w-7 h-7 ${classes.iconText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{subtitle}</p>
      
      <div className="absolute bottom-6 right-6 text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-2 group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </button>
  );
};
/* -------------------------------------------------------------------------- */
/*                                Page shell                                 */
/* -------------------------------------------------------------------------- */
export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [isCreateDeckModalOpen, setCreateDeckModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'decks' | 'quiz' | 'stats' | 'settings' | 'deck-detail' | 'deck-creation'>('dashboard');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [decksList, setDecksList] = useState<Deck[]>([]);
  const [isLoadingDecks, setIsLoadingDecks] = useState(true);

  useEffect(() => {
    const loadDecks = async () => {
      if (!currentUser) {
        setDecksList([]);
        setIsLoadingDecks(false);
        return;
      }
      try {
        setIsLoadingDecks(true);
        const userDecks = await decks.getDecks(currentUser.id);
        setDecksList(userDecks);
      } catch (err) {
        console.error('Erreur lors du chargement des decks:', err);
      } finally {
        setIsLoadingDecks(false);
      }
    };

    loadDecks();
  }, [currentUser]);

  const handleDeckCreated = (newDeck: Deck) => {
    setDecksList(prev => [newDeck, ...prev]);
    setActiveTab('decks'); // Switch to decks view after creation
  };

  const handleDeckDeleted = (deckId: string) => {
    setDecksList(prev => prev.filter(deck => deck.id !== deckId));
  };

  const handleDeckUpdated = (updatedDeck: Deck) => {
    setDecksList(prev => prev.map(deck => (deck.id === updatedDeck.id ? updatedDeck : deck)));
  };

  const handleDeckClick = async (deck: Deck) => {
    setSelectedDeck(deck);
    setActiveTab('deck-detail');
    
    // Afficher toutes les propriétés du deck pour débogage
    console.log('Deck sélectionné:', JSON.stringify(deck, null, 2));
    
    if (deck.pdf_file_path) {
      console.log('Chemin PDF stocké:', deck.pdf_file_path);
      console.log('Tentative de récupération depuis le bucket:', 'pdfs');
      
      try {
        // Utiliser directement createSignedUrl au lieu de getPublicUrl
        // pour contourner les restrictions de politique d'accès
        const { data: signedData, error } = await supabase.storage
          .from('pdfs')
          .createSignedUrl(deck.pdf_file_path, 3600); // URL valide pour 1 heure
          
        if (error) {
          console.error('Erreur lors de la création de l\'URL signée:', error);
          setPdfUrl(null);
          return;
        }
        
        if (signedData && signedData.signedUrl) {
          console.log('URL signée obtenue:', signedData.signedUrl);
          setPdfUrl(signedData.signedUrl);
        } else {
          console.error('Impossible d\'obtenir une URL signée');
          setPdfUrl(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'URL du PDF:', error);
        setPdfUrl(null);
      }
    } else {
      console.log('Aucun chemin PDF stocké pour ce deck');
      setPdfUrl(null);
    }
  };

  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setActiveTab('decks');
  };

  const renderView = () => {
    switch (activeTab) {
            case 'dashboard':
        return <DashboardHomeView onOpenCreateDeckModal={() => setCreateDeckModalOpen(true)} deckCount={decksList.length} />;
            case 'decks':
        return (
          <DecksView
            initialDecks={decksList}
            isLoading={isLoadingDecks}
            onDeckClick={handleDeckClick}
            onDeckDeleted={handleDeckDeleted}
            onDeckUpdated={handleDeckUpdated}
            onOpenCreateDeckModal={() => setCreateDeckModalOpen(true)}
          />
        );
      case 'deck-detail':
        return selectedDeck ? <DeckDetailView deck={selectedDeck} onBack={handleBackToDecks} onDeckDeleted={handleDeckDeleted} onDeckUpdated={handleDeckUpdated} pdfUrl={pdfUrl} /> : null;
      case 'quiz':
        return <QuizView />;
      case 'stats':
        return <StatsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar
          activeView={activeTab}
          onChangeView={(view) => {
            // When navigating back to the main 'decks' view, reset the selected deck.
            if (view === 'decks' && selectedDeck) {
              setSelectedDeck(null);
            }
            setActiveTab(view);
          }}
        />
        <main className="flex-1 overflow-y-auto ml-20 md:ml-60 bg-white dark:bg-slate-950">
          {renderView()}
        </main>
      </div>

      {/* Modal */}
      <NewCreateDeckModal
        isOpen={isCreateDeckModalOpen}
        onClose={() => setCreateDeckModalOpen(false)}
        onDeckCreated={handleDeckCreated}
      />
    </ProtectedRoute>
  );
}
