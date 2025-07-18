import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ success: false, error: 'Clé API non fournie ou invalide.' }, { status: 400 });
    }

    // Validation simple : requête GET sur la liste des modèles disponibles.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

    if (!response.ok) {
      // Statut non 200 signifie probablement clé invalide ou modèle inaccessible.
      const errorText = await response.text();
      throw new Error(`Erreur API (${response.status}): ${errorText}`);
    }

    return NextResponse.json({ success: true, message: 'La clé API est valide.' });

  } catch (error: any) {
    console.error('Erreur lors du test de la clé API Gemini:', error);
    // Les erreurs de l'API Google contiennent souvent des informations utiles
    const errorMessage = error.message?.includes('API key not valid') 
      ? 'Clé API invalide. Veuillez vérifier votre clé.'
      : 'Une erreur est survenue lors de la validation de la clé API.';

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
