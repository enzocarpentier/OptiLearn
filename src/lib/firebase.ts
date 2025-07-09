import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

// Vérifier que toutes les variables requises sont présentes
const missingVars: string[] = [];
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

for (const field of requiredFields) {
  if (!firebaseConfig[field as keyof typeof firebaseConfig]) {
    missingVars.push(`NEXT_PUBLIC_FIREBASE_${field.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '')}`);
  }
}

// Variables pour les exports
let app: any = null;
let auth: any = null;
let googleProvider: any = null;
let db: any = null;
let analytics: any = null;

// Si des variables sont manquantes, ne pas initialiser Firebase
if (missingVars.length > 0) {
  // Afficher les erreurs seulement côté client
  if (typeof window !== 'undefined') {
    console.error('🔥 Configuration Firebase incomplète!');
    console.error('📝 Créez un fichier .env.local à la racine du projet avec les variables suivantes:');
    missingVars.forEach(varName => {
      console.error(`${varName}=your-value-here`);
    });
    console.error('📖 Consultez FIREBASE_SETUP.md pour plus d\'informations');
  }
  
  // Laisser les valeurs à null
  auth = null;
  googleProvider = null;
  db = null;
  analytics = null;
  app = null;
} else {

  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);

  // Configure Google Auth Provider
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);

  // Initialize Analytics (only on client side)
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
}

// Exports au niveau top-level
export { auth, googleProvider, db, analytics };
export default app; 