import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import emailjs from '@emailjs/browser';

export interface FeedbackData {
  type: 'bug' | 'feature';
  message: string;
  userAgent?: string;
  url?: string;
  timestamp?: any;
}

// Configuration EmailJS (à remplir avec vos vraies clés)
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id', // À remplacer
  TEMPLATE_ID: 'your_template_id', // À remplacer
  PUBLIC_KEY: 'your_public_key', // À remplacer
};

export const submitFeedback = async (feedbackData: Omit<FeedbackData, 'timestamp' | 'userAgent' | 'url'>) => {
  try {
    // Ajouter des métadonnées utiles
    const enrichedFeedback: FeedbackData = {
      ...feedbackData,
      timestamp: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    // Ajouter le document dans la collection 'feedbacks'
    const docRef = await addDoc(collection(db, 'feedbacks'), enrichedFeedback);
    
    console.log('Feedback envoyé avec l\'ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du feedback:', error);
    return { success: false, error: error };
  }
};
