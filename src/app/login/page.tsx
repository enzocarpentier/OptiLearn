'use client';

import { useEffect } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { openModal } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    // Ouvre la modale de connexion dès que la page est montée
    openModal('login');
    // Redirige vers la page d'accueil en arrière-plan
    router.replace('/');
  }, [openModal, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Redirection en cours...</p>
    </div>
  );
}