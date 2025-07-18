'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PasswordInput } from '@/components/PasswordInput';
import { PasswordStrength } from '@/components/PasswordStrength';

export const PasswordSettingsView = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(criteria).filter(Boolean).length;
    return { isValid: score >= 4 };
  };

  const updatePasswordHandler = async () => {
    setError('');
    setSuccess('');

    setLoading(true);

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Utilisateur non authentifié.');
      setLoading(false);
      return;
    }

    // 2. Verify current password by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      setError('Le mot de passe actuel est incorrect.');
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword).isValid) {
      setError('Votre nouveau mot de passe ne respecte pas les critères de sécurité.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    // 3. Update the password
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setSuccess('Mot de passe mis à jour avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(`Erreur lors de la mise à jour du mot de passe : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">Sécurité</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Changer de mot de passe</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Nous vous recommandons d'utiliser un mot de passe fort que vous n'utilisez nulle part ailleurs.</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordStrength password={newPassword} />
          </div>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-4 text-right">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-4 text-right">{success}</p>}
      <div className="flex justify-end mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button 
          onClick={updatePasswordHandler} 
          disabled={loading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </button>
      </div>
    </section>
  );
};
