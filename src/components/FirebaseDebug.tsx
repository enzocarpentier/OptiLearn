'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

interface DebugInfo {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  authInitialized: string;
  currentDomain: string;
  currentUrl: string;
}

export default function FirebaseDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    // Vérifier la configuration Firebase
    const config: DebugInfo = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Définie' : '✗ Manquante',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Définie' : '✗ Manquante',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Définie' : '✗ Manquante',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Définie' : '✗ Manquante',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Définie' : '✗ Manquante',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Définie' : '✗ Manquante',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✓ Définie' : '⚠️ Optionnelle',
      authInitialized: auth ? '✓ Initialisé' : '✗ Erreur',
      currentDomain: window.location.hostname,
      currentUrl: window.location.href
    };

    setDebugInfo(config);
  }, []);

  // Ne pas afficher en production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!debugInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔧 Firebase Debug</h3>
      <div className="space-y-1">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="capitalize">{key}:</span>
            <span className={value.includes('✓') ? 'text-green-400' : 
                           value.includes('✗') ? 'text-red-400' : 'text-yellow-400'}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 