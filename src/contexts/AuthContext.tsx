'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  firebaseConfigured: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseConfigured = auth !== null;

  async function signup(email: string, password: string, firstName: string, lastName: string) {
    if (!auth) {
      throw new Error('Firebase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Firebase.');
    }
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
  }

  async function login(email: string, password: string) {
    if (!auth) {
      throw new Error('Firebase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Firebase.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    if (!auth) {
      throw new Error('Firebase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Firebase.');
    }
    await signOut(auth);
  }

  useEffect(() => {
    if (!auth) {
      // Si Firebase n'est pas configuré, on met loading à false pour permettre l'affichage
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    firebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 