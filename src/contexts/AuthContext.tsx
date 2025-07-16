'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, isSupabaseConfigured, User, supabase } from '@/lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  supabaseConfigured: boolean;
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
  const supabaseConfigured = isSupabaseConfigured();

  async function signup(email: string, password: string, firstName: string, lastName: string) {
    if (!supabaseConfigured) {
      throw new Error('Supabase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Supabase.');
    }
    
    try {
      await auth.signUp(email, password, firstName, lastName);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    if (!supabaseConfigured) {
      throw new Error('Supabase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Supabase.');
    }
    
    try {
      await auth.signIn(email, password);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async function logout() {
    if (!supabaseConfigured) {
      throw new Error('Supabase n\'est pas configuré. Veuillez créer un fichier .env.local avec vos clés Supabase.');
    }
    
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      console.warn('⚠️ Supabase non configuré - fonctionnalités d\'authentification indisponibles');
      setLoading(false);
      return;
    }

    // Fonction pour initialiser l'authentification de façon plus sûre
    const initAuth = async () => {
      try {
        // Vérifier d'abord si une session existe dans localStorage
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Une session existe, nous pouvons essayer de récupérer l'utilisateur
          try {
            const user = await auth.getUser();
            setCurrentUser(user as User);
          } catch (e) {
            console.warn('Impossible de récupérer les détails utilisateur malgré une session existante:', e);
            setCurrentUser(null);
          }
        } else {
          // Pas de session active
          console.info('Aucune session active détectée');
          setCurrentUser(null);
        }
      } catch (error: any) {
        console.error('Erreur lors de la vérification de session:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => subscription.unsubscribe();
  }, [supabaseConfigured]);

  const value: AuthContextType = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    supabaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 