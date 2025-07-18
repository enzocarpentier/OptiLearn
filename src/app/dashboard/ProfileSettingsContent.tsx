"use client";

import { useState, useEffect, useRef } from 'react';
import type { User } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSettingsContent = ({ user, logout }: { user: User | null; logout: () => Promise<void> }) => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false);
  const [isTestingApiKey, setIsTestingApiKey] = useState(false);
  const [isDeletingApiKey, setIsDeletingApiKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [highlight, setHighlight] = useState(false);
  const geminiApiSectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('section') === 'api-key' && geminiApiSectionRef.current) {
      geminiApiSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setHighlight(true);
      setTimeout(() => setHighlight(false), 2000);
    }
  }, [searchParams]);

  useEffect(() => {
    // Vérifier le statut de la clé API au chargement
    checkApiKeyStatus();
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl },
      });
      if (error) throw error;
      toast.success('Profil mis à jour avec succès !');
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const checkApiKeyStatus = async () => {
    setIsCheckingApiKey(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const response = await fetch('/api/user/api-key', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      const data = await response.json();
      
      if (response.ok) {
        setHasApiKey(data.hasApiKey);
        if (data.apiKey) {
          setGeminiApiKey(data.apiKey);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la clé API:', error);
    } finally {
      setIsCheckingApiKey(false);
    }
  };

  const handleUpdateApiKey = async () => {
    if (!geminiApiKey) {
      toast.error('Veuillez entrer une clé API.');
      return;
    }
    
    setIsUpdatingApiKey(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const response = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ apiKey: geminiApiKey }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      toast.success(data.message || 'Clé API sauvegardée avec succès !');
      setGeminiApiKey('');
      // Recharger le statut après la sauvegarde
      checkApiKeyStatus();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsUpdatingApiKey(false);
    }
  };

  const handleDeleteApiKey = async () => {
    setIsDeletingApiKey(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      const response = await fetch('/api/user/api-key', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Échec de la suppression.');
      }
      toast.success(data.message || 'Clé API supprimée.');
      setHasApiKey(false);
      setGeminiApiKey('');
    } catch (error:any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsDeletingApiKey(false);
    }
  };

  const handleTestApiKey = async () => {
    if (!geminiApiKey) {
      toast.error('Veuillez entrer une clé API à tester.');
      return;
    }
    setIsTestingApiKey(true);
    try {
      const response = await fetch('/api/user/test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: geminiApiKey }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Clé API invalide ou erreur inconnue.');
      }
      toast.success('La clé API est valide et fonctionnelle !');
    } catch (error: any) {
      toast.error(`Test échoué: ${error.message}`);
    } finally {
      setIsTestingApiKey(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Chargement des informations utilisateur...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">Profil</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Nom et informations</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Modifiez vos informations personnelles.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nom complet</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition mt-1"
              />
            </div>
            <button type="button" onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition">
              {isUpdatingProfile ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </button>
          </div>
        </div>
      </section>

      {/* API & Logout Section */}
      <section className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">Paramètres de l'application</h2>
        {/* Gemini API Key Section */}
        <div id="gemini-api-key" ref={geminiApiSectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-6">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Clé API Gemini</h3>
              {isCheckingApiKey ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : hasApiKey ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Configurée</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-amber-600">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Non configurée</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Votre clé API pour activer l'assistant IA. Votre clé est stockée de manière sécurisée.</p>
          </div>
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Entrez votre clé API Google Gemini"
                className="w-full px-4 py-2.5 pr-10 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Obtenez votre clé API depuis <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.</p>
            <div className="flex items-center space-x-2 mt-4">
              <button type="button" onClick={handleUpdateApiKey} disabled={isUpdatingApiKey || !geminiApiKey} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition">
                {isUpdatingApiKey ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button type="button" onClick={handleTestApiKey} disabled={isTestingApiKey || !geminiApiKey} className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 transition">
                {isTestingApiKey ? 'Test...' : 'Tester la clé'}
              </button>
              {hasApiKey && (
                <button type="button" onClick={handleDeleteApiKey} disabled={isDeletingApiKey} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition">
                  {isDeletingApiKey ? 'Suppression...' : 'Supprimer'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-8 mt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="md:col-span-1">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Déconnexion</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Se déconnecter de votre session actuelle.</p>
          </div>
          <div className="md:col-span-2">
            <button type="button" onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Se déconnecter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
