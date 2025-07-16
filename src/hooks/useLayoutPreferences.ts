'use client';

import { useState, useEffect, useCallback } from 'react';

// Interface pour les préférences de layout
export interface LayoutPreferences {
  leftPanelWidth: number;
  rightPanelWidth: number;
  isRightPanelCollapsed: boolean;
  autoHideHeader: boolean;
  lastUsed: Date;
}

// Valeurs par défaut
const DEFAULT_PREFERENCES: LayoutPreferences = {
  leftPanelWidth: 65,
  rightPanelWidth: 35,
  isRightPanelCollapsed: false,
  autoHideHeader: true,
  lastUsed: new Date(),
};

// Clé pour localStorage
const STORAGE_KEY = 'optilearn-layout-preferences';

// Hook pour gérer les préférences de layout
export const useLayoutPreferences = () => {
  const [preferences, setPreferences] = useState<LayoutPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Valider les données
        if (parsed && typeof parsed === 'object') {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...parsed,
            lastUsed: new Date(parsed.lastUsed || Date.now()),
          });
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des préférences de layout:', error);
      // Utiliser les valeurs par défaut en cas d'erreur
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder les préférences
  const savePreferences = useCallback((newPreferences: Partial<LayoutPreferences>) => {
    const updated = {
      ...preferences,
      ...newPreferences,
      lastUsed: new Date(),
    };

    setPreferences(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des préférences de layout:', error);
    }
  }, [preferences]);

  // Méthodes utilitaires
  const updatePanelWidths = useCallback((leftWidth: number, rightWidth: number) => {
    // Valider les largeurs
    const validLeftWidth = Math.max(20, Math.min(80, leftWidth));
    const validRightWidth = 100 - validLeftWidth;

    savePreferences({
      leftPanelWidth: validLeftWidth,
      rightPanelWidth: validRightWidth,
    });
  }, [savePreferences]);

  const toggleRightPanel = useCallback(() => {
    savePreferences({
      isRightPanelCollapsed: !preferences.isRightPanelCollapsed,
    });
  }, [preferences.isRightPanelCollapsed, savePreferences]);

  const toggleAutoHideHeader = useCallback(() => {
    savePreferences({
      autoHideHeader: !preferences.autoHideHeader,
    });
  }, [preferences.autoHideHeader, savePreferences]);

  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Erreur lors de la suppression des préférences:', error);
    }
  }, []);

  return {
    preferences,
    isLoaded,
    updatePanelWidths,
    toggleRightPanel,
    toggleAutoHideHeader,
    resetToDefaults,
    savePreferences,
  };
};