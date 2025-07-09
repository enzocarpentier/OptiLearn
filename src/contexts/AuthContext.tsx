'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  UserCredential,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  firebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const firebaseConfigured = auth !== null && googleProvider !== null;

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

  async function signInWithGoogle(): Promise<UserCredential | undefined> {
    if (!auth || !googleProvider) {
      throw new Error('Firebase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Firebase.');
    }
    
    try {
      console.log('Tentative de connexion Google...');
      
      // Vérifier si nous sommes dans un environnement mobile ou si les popups sont bloquées
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      let result: UserCredential | undefined;
      
      if (isMobile) {
        // Utiliser la redirection sur mobile
        console.log('Utilisation de la redirection (mobile détecté)');
        await signInWithRedirect(auth, googleProvider);
        return undefined; // La redirection va gérer la suite
      } else {
        // Utiliser la popup sur desktop
        console.log('Utilisation de la popup (desktop)');
        result = await signInWithPopup(auth, googleProvider);
      }
      
      if (result) {
        console.log('Connexion Google réussie:', result.user.email);
        return result;
      }
      
      return undefined;
    } catch (error) {
      const authError = error as AuthError;
      console.error('Erreur détaillée de connexion Google:', {
        code: authError.code,
        message: authError.message,
        customData: authError.customData
      });
      
      // Gestion spécifique des erreurs
      if (authError.code === 'auth/popup-blocked') {
        console.log('Popup bloquée, tentative avec redirection...');
        try {
          await signInWithRedirect(auth, googleProvider);
          return undefined;
        } catch (redirectError) {
          const redirectAuthError = redirectError as AuthError;
          console.error('Erreur avec redirection:', redirectAuthError);
          throw redirectAuthError;
        }
      }
      
      throw authError;
    }
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

    // Vérifier s'il y a un résultat de redirection au chargement
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('Connexion par redirection réussie:', result.user.email);
        }
      })
      .catch((error) => {
        const authError = error as AuthError;
        console.error('Erreur lors de la récupération du résultat de redirection:', authError);
      });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    firebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 