'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Icônes
const BrainCircuit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.5a4.5 4.5 0 0 0-4.5 4.5v0a4.5 4.5 0 0 0 4.5 4.5v.5a4.5 4.5 0 1 0 9 0v-.5a4.5 4.5 0 0 0 4.5-4.5v0a4.5 4.5 0 0 0-4.5-4.5v-.5A4.5 4.5 0 0 0 12 2Z" />
    <path d="M12 11.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5h0a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5Z" />
    <path d="M3 12h.5" /><path d="M20.5 12H21" /><path d="M12 3V2.5" /><path d="M12 21.5V21" />
    <path d="m4.929 4.929.353.353" /><path d="m18.717 18.717.354.354" /><path d="m18.717 4.929-.353.353" /><path d="m4.929 18.717-.353.354" />
  </svg>
);

// Modern dashboard grid icon
const DashboardGridIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM20 3h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM10 13H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM20 13h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1z"/>
  </svg>
);

const FileText = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
    </svg>
);

const HelpCircle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
    </svg>
);

const BarChart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" />
    </svg>
);

const Settings = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const LogOut = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);


const NavLink = ({ isActive, onSelect, children, icon }: { isActive: boolean; onSelect: () => void; children: React.ReactNode; icon: React.ReactNode }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full text-left relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-out text-sm font-medium overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500/30 transform hover:-translate-y-0.5 active:scale-[0.98]
        ${isActive
          ? 'text-blue-700 dark:text-white bg-white/70 dark:bg-slate-800 shadow-md shadow-blue-500/10 dark:shadow-black/20 ring-1 ring-inset ring-blue-500/20 dark:ring-slate-700'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50 hover:shadow-md hover:shadow-blue-100/50 dark:hover:shadow-none'}
      `}
    >
      {/* Icon container with enhanced styling */}
      <span className={`relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ease-out mr-3 ${isActive 
          ? 'text-blue-600 dark:text-white bg-blue-100/80 dark:bg-slate-700 shadow-sm'
          : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white group-hover:bg-white/80 dark:group-hover:bg-slate-800 group-hover:shadow-sm group-hover:scale-110'
      }`}>
        {icon}
      </span>
      
      {/* Text with enhanced typography */}
      <span className={`hidden md:inline whitespace-nowrap relative transition-all duration-300 ease-out ${
        isActive 
          ? 'font-semibold'
          : 'group-hover:font-medium'
      }`}>
        {children}
      </span>
    </button>
  );
};

interface SidebarProps {
  activeView: 'dashboard' | 'decks' | 'quiz' | 'stats' | 'settings' | 'deck-detail' | 'deck-creation';
  onChangeView: (view: 'dashboard' | 'decks' | 'quiz' | 'stats' | 'settings' | 'deck-detail' | 'deck-creation') => void;
}

export default function Sidebar({ activeView, onChangeView }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return;
      }
      router.push('/');
    } catch (error) {
      console.error('Erreur inattendue lors de la déconnexion:', error);
    }
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-20 md:w-60 z-30 flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
      <nav className="flex flex-col justify-between h-full px-0 md:px-4 py-4">
        {/* Logo/Header */}
        <div className="flex flex-col items-center w-full mb-6">
          <button
            type="button"
            onClick={() => onChangeView('dashboard')}
            className="group relative bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:outline-none active:ring-0 shadow-none p-3 m-0 w-full rounded-xl transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-white/20 hover:to-cyan-50/30 dark:hover:from-slate-800/30 dark:hover:via-slate-700/20 dark:hover:to-slate-800/30"
            tabIndex={0}
          >
            <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 via-teal-400 to-emerald-500 bg-clip-text text-transparent text-center w-full block transition-all duration-300 ease-out group-hover:scale-105 group-hover:brightness-110 group-active:scale-95">
              OptiLearn
            </span>
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-emerald-500/5" />
          </button>
          
          {/* Enhanced divider */}
          <div className="w-4/5 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-slate-600/60 mt-4 mb-6"></div>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col gap-2 flex-1">
          <NavLink
            isActive={activeView === 'dashboard'}
            onSelect={() => onChangeView('dashboard')}
            icon={<DashboardGridIcon className="w-6 h-6 font-bold transition-all duration-200" />}
          >
            Tableau de bord
          </NavLink>
          <NavLink isActive={activeView === 'decks'} onSelect={() => onChangeView('decks')} icon={<FileText className="w-5 h-5" />}>Mes Decks</NavLink>
          <NavLink isActive={activeView === 'quiz'} onSelect={() => onChangeView('quiz')} icon={<HelpCircle className="w-5 h-5" />}>Quiz</NavLink>
          <NavLink isActive={activeView === 'stats'} onSelect={() => onChangeView('stats')} icon={<BarChart className="w-5 h-5" />}>Statistiques</NavLink>
          <NavLink isActive={activeView === 'settings'} onSelect={() => onChangeView('settings')} icon={<Settings className="w-5 h-5" />}>Paramètres</NavLink>
        </div>
        {/* Logout Button sticky bottom */}
        <div className="mt-4 pt-2 pb-1">
          <button
            onClick={handleLogout}
            className="relative flex items-center w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium overflow-hidden text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </nav>
    </aside>
  );
}
