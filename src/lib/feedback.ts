import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';


export interface FeedbackData {
  type: 'bug' | 'feature';
  message: string;
  userAgent?: string;
  url?: string;
  timestamp?: unknown;
}



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
