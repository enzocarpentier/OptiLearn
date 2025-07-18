import { Sparkles } from 'lucide-react';
import DeckTabs, { DeckTabId } from './DeckTabs';

interface ComingSoonPanelProps {
  label?: string;
  activeTab?: DeckTabId;
  onTabSelect?: (id: DeckTabId) => void;
}

const ComingSoonPanel = ({ label = 'Bientôt disponible', activeTab = 'assistant', onTabSelect }: ComingSoonPanelProps) => {
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-200/20 dark:border-slate-800/20 flex flex-col">
      {/* Header -- Apple-style professional design */}
      <div className="relative">
        {/* Main header container */}
        <div className="flex items-center justify-center py-4 px-6">
          {/* Centered navigation */}
          {onTabSelect && (
            <DeckTabs activeTab={activeTab} onTabSelect={onTabSelect} className="" />
          )}
        </div>
        
        {/* Elegant transition with gradient and shadow */}
        <div className="relative">
          {/* Main separator line */}
          <div className="border-b border-slate-200/40 dark:border-slate-700/40" />
          {/* Subtle gradient overlay for smooth transition */}
          <div className="absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-b from-slate-50/20 to-transparent dark:from-slate-800/20 pointer-events-none" />
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400 mb-4" />
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cette fonctionnalité sera bientôt activée.</p>
      </div>
    </div>
  );
};

export default ComingSoonPanel;
