'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMouseInactivityOptions {
  timeout?: number; // Temps d'inactivité en millisecondes
  enabled?: boolean; // Activer/désactiver la détection
}

// Hook pour détecter l'inactivité de la souris
export const useMouseInactivity = (options: UseMouseInactivityOptions = {}) => {
  const { timeout = 3000, enabled = true } = options;
  
  const [isInactive, setIsInactive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Réinitialiser le timer d'inactivité
  const resetInactivityTimer = useCallback(() => {
    if (!enabled) return;

    // Annuler le timer précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Marquer comme actif
    setIsInactive(false);

    // Démarrer un nouveau timer
    timeoutRef.current = setTimeout(() => {
      setIsInactive(true);
    }, timeout);
  }, [enabled, timeout]);

  // Gestionnaire de mouvement de souris
  const handleMouseMove = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Gestionnaire de survol (pour réactiver)
  const handleMouseEnter = useCallback(() => {
    if (enabled) {
      setIsInactive(false);
      resetInactivityTimer();
    }
  }, [enabled, resetInactivityTimer]);

  // Gestionnaire de sortie de survol
  const handleMouseLeave = useCallback(() => {
    if (enabled) {
      resetInactivityTimer();
    }
  }, [enabled, resetInactivityTimer]);

  // Effet pour configurer les écouteurs d'événements
  useEffect(() => {
    if (!enabled) {
      setIsInactive(false);
      return;
    }

    // Ajouter les écouteurs
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Démarrer le timer initial
    resetInactivityTimer();

    // Nettoyage
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleMouseMove, handleMouseEnter, resetInactivityTimer]);

  // Forcer l'état actif
  const forceActive = useCallback(() => {
    setIsInactive(false);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  // Forcer l'état inactif
  const forceInactive = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsInactive(true);
  }, []);

  return {
    isInactive,
    forceActive,
    forceInactive,
    handleMouseEnter,
    handleMouseLeave,
  };
};