"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ConfirmDeleteAccountModal from '@/components/ConfirmDeleteAccountModal';

export const DangerZoneView = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Note: La suppression de l'utilisateur doit être gérée côté serveur via une fonction Edge
      // pour des raisons de sécurité (RLS ne peut pas être contourné côté client pour la suppression de soi-même).
      // https://supabase.com/docs/guides/auth/managing-user-data#deleting-users
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      // Déconnexion après la suppression
      await supabase.auth.signOut();
      router.push('/'); // Redirection vers la page d'accueil
      alert('Votre compte a été supprimé avec succès.');
    } catch (err: any) {
      alert(`Erreur lors de la suppression du compte : ${err.message}`);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-red-600 border-b border-red-200 pb-4 mb-6">Zone de Danger</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1">
          <h3 className="font-semibold text-red-800">Supprimer le compte</h3>
          <p className="text-sm text-red-500 mt-1">Cette action est irréversible. Toutes vos données seront définitivement perdues.</p>
        </div>
        <div className="md:col-span-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Supprimer mon compte
          </button>
          <ConfirmDeleteAccountModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDeleteAccount}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
};
