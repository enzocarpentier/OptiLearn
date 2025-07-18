import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/security';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

/**
 * Analyse un document et renvoie une liste de sections avec titre et résumé.
 * Expects { context: string }
 */
export async function POST(request: Request) {
  const { context } = await request.json();
  if (!context) {
    return NextResponse.json({ error: 'Le contexte est requis.' }, { status: 400 });
  }

  // Auth + service client
  const supabase = createRouteHandlerClient({ cookies });
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Récupère utilisateur
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || '12345678-1234-1234-1234-123456789abc';

  // Récupère clé API Gemini
  const { data: profile } = await serviceSupabase.from('profiles').select('encrypted_gemini_api_key').eq('id', userId).single();
  const apiKey = profile?.encrypted_gemini_api_key ? decrypt(profile.encrypted_gemini_api_key) : null;
  if (!apiKey) return NextResponse.json({ error: 'Clé Gemini manquante' }, { status: 400 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const systemPrompt = `Vous êtes OptiLearn, un assistant pédagogique. Analyse le document suivant et renvoie un JSON contenant un tableau \"sections\". Chaque élément doit avoir: title, summary. Ne retourne rien d'autre qu'un JSON valide.`;
  const prompt = `${systemPrompt}\n\n---\n${context.slice(0, 12000)}\n---`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Tente de parser JSON
    const jsonStart = text.indexOf('{');
    const json = JSON.parse(text.slice(jsonStart));
    return NextResponse.json(json);
  } catch (e: any) {
    console.error('Analyse error', e);
    return NextResponse.json({ error: 'Erreur analyse' }, { status: 500 });
  }
}
