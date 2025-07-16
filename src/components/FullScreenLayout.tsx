'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLayoutPreferences } from '@/hooks/useLayoutPreferences';
import { useMouseInactivity } from '@/hooks/useMouseInactivity';

// Types et interfaces
export interface FullScreenLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  onBack: () => void;
  title: string;
  subtitle?: string;
}

export interface LayoutState {
  leftWidth: number;
  rightWidth: number;
  isRightCollapsed: boolean;
  isHeaderVisible: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

// Breakpoints responsive
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
  desktop: Infinity
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

// Hook pour la détection des breakpoints
export const useResponsiveBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setBreakpoint('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Initialiser
    updateBreakpoint();

    // Écouter les changements
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Composant principal FullScreenLayout
const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({
  leftPanel,
  rightPanel,
  onBack,
  title,
  subtitle
}) => {
  const breakpoint = useResponsiveBreakpoint();
  
  // Hooks pour les préférences et l'inactivité
  const { preferences, toggleRightPanel, updatePanelWidths } = useLayoutPreferences();
  const { isInactive, handleMouseEnter, handleMouseLeave } = useMouseInactivity({
    timeout: 3000,
    enabled: preferences.autoHideHeader
  });

  // État du layout basé sur les préférences
  const [layoutState, setLayoutState] = useState<LayoutState>({
    leftWidth: preferences.leftPanelWidth,
    rightWidth: preferences.rightPanelWidth,
    isRightCollapsed: preferences.isRightPanelCollapsed,
    isHeaderVisible: !isInactive,
    breakpoint
  });

  // Mettre à jour l'état quand les préférences changent
  useEffect(() => {
    setLayoutState(prev => ({
      ...prev,
      leftWidth: preferences.leftPanelWidth,
      rightWidth: preferences.rightPanelWidth,
      isRightCollapsed: preferences.isRightPanelCollapsed,
    }));
  }, [preferences]);

  // Mettre à jour le breakpoint dans l'état
  useEffect(() => {
    setLayoutState(prev => ({ ...prev, breakpoint }));
  }, [breakpoint]);

  // Mettre à jour la visibilité du header selon l'inactivité
  useEffect(() => {
    setLayoutState(prev => ({ 
      ...prev, 
      isHeaderVisible: !isInactive || breakpoint === 'mobile' 
    }));
  }, [isInactive, breakpoint]);

  // Calculer les largeurs en fonction du breakpoint
  const getResponsiveWidths = useCallback(() => {
    if (layoutState.isRightCollapsed) {
      return { left: '100%', right: '0%' };
    }

    switch (breakpoint) {
      case 'mobile':
        return { left: '100%', right: '100%' }; // Mode empilé
      case 'tablet':
        return { left: '60%', right: '40%' };
      case 'desktop':
      default:
        return { 
          left: `${layoutState.leftWidth}%`, 
          right: `${layoutState.rightWidth}%` 
        };
    }
  }, [breakpoint, layoutState.leftWidth, layoutState.rightWidth, layoutState.isRightCollapsed]);

  const widths = getResponsiveWidths();

  // Styles CSS personnalisés
  const layoutStyles = {
    '--left-width': widths.left,
    '--right-width': widths.right,
  } as React.CSSProperties;

  return (
    <div 
      className="fixed inset-0 w-full h-full bg-gray-50 overflow-hidden"
      style={layoutStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header flottant */}
      <div 
        className={`absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
          layoutState.isHeaderVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux decks
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 truncate" title={title}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Contrôles de layout */}
          <div className="flex items-center space-x-2">
            {/* Bouton pour basculer l'assistant IA */}
            {breakpoint !== 'mobile' && (
              <button
                onClick={toggleRightPanel}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={layoutState.isRightCollapsed ? "Afficher l'assistant IA" : "Masquer l'assistant IA"}
              >
                {layoutState.isRightCollapsed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            )}
            
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {breakpoint}
            </span>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="w-full h-full pt-16 flex">
        {/* Mode desktop/tablet - côte à côte */}
        {breakpoint !== 'mobile' && (
          <>
            {/* Panneau gauche - PDF */}
            <div 
              className="h-full overflow-hidden transition-all duration-300 ease-in-out"
              style={{ width: widths.left }}
            >
              <div className="h-full p-4">
                {leftPanel}
              </div>
            </div>

            {/* Panneau droit - AI Assistant */}
            {!layoutState.isRightCollapsed && (
              <div 
                className="h-full overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200"
                style={{ width: widths.right }}
              >
                <div className="h-full p-4">
                  {rightPanel}
                </div>
              </div>
            )}
          </>
        )}

        {/* Mode mobile - empilé avec onglets */}
        {breakpoint === 'mobile' && (
          <div className="w-full h-full flex flex-col">
            {/* Onglets */}
            <div className="flex border-b border-gray-200 bg-white">
              <button className="flex-1 py-3 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                PDF
              </button>
              <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                Assistant IA
              </button>
            </div>
            
            {/* Contenu */}
            <div className="flex-1 overflow-hidden p-4">
              {leftPanel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenLayout;