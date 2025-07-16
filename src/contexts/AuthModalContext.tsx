'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthView = 'login' | 'signup';

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthView;
  openModal: (view: AuthView) => void;
  closeModal: () => void;
  switchTo: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>('login');

  const openModal = (view: AuthView) => {
    setView(view);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const switchTo = (view: AuthView) => {
    setView(view);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, view, openModal, closeModal, switchTo }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
