import React from 'react';
import { Sparkles, Brain, FileText, CreditCard } from 'lucide-react';

export type DeckTabId = 'assistant' | 'quiz' | 'resume' | 'flashcard';

interface DeckTabsProps {
  activeTab: DeckTabId;
  onTabSelect: (id: DeckTabId) => void;
  className?: string;
}

const tabs: { id: DeckTabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'assistant', label: 'Assistant', icon: Sparkles },
  { id: 'quiz', label: 'Quiz', icon: Brain },
  { id: 'resume', label: 'Résumé', icon: FileText },
  { id: 'flashcard', label: 'Flashcard', icon: CreditCard },
];

/**
 * Professional Apple-style tab navigation for deck views.
 * Clean, minimal design with subtle animations and proper spacing.
 */
const DeckTabs: React.FC<DeckTabsProps> = ({ activeTab, onTabSelect, className = '' }) => {
  return (
    <div className={`relative ${className}`.trim()}>
      {/* Background container with subtle border */}
      <div className="bg-slate-50/80 dark:bg-slate-800/50 apple-tab-container rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <nav className="flex items-center gap-1 relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabSelect(tab.id)}
                className={`
                  apple-tab-button relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 ease-out min-w-0 flex-shrink-0
                  ${isActive 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-600/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }
                `}
              >
                <Icon 
                  size={14} 
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-slate-500'
                  }`} 
                />
                <span className="truncate">{tab.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg ring-1 ring-indigo-500/20 dark:ring-indigo-400/20" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DeckTabs;
