'use client';

import { useEffect, useState } from 'react';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Appeler le hook au niveau supérieur du composant
  const { openModal } = useAuthModal();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      try {
        // Ouvre la modale de connexion
        openModal('login');
        // Redirige vers la page d'accueil en arrière-plan
        router.replace('/');
      } catch (error) {
        console.error("Erreur lors de l'ouverture de la modale:", error);
        // Rediriger vers la page d'accueil même en cas d'erreur
        router.replace('/');
      }
    }
  }, [isMounted, router, openModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Redirection en cours...</p>
    </div>
  );
}