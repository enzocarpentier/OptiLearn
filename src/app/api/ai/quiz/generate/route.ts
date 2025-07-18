import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/security';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

/**
 * Génère un quiz à partir d'une section de texte fournie.
 * Expects { sectionText: string, deckId?: string }
 */
export async function POST(request: Request) {
  const { sectionText } = await request.json();
  if (!sectionText) return NextResponse.json({ error: 'sectionText requis' }, { status: 400 });

  const supabase = createRouteHandlerClient({ cookies });
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || '12345678-1234-1234-1234-123456789abc';
  const { data: profile } = await serviceSupabase.from('profiles').select('encrypted_gemini_api_key').eq('id', userId).single();
  const apiKey = profile?.encrypted_gemini_api_key ? decrypt(profile.encrypted_gemini_api_key) : null;
  if (!apiKey) return NextResponse.json({ error: 'Clé Gemini manquante' }, { status: 400 });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const systemPrompt = `Vous êtes OptiLearn. Générez un quiz de 5 questions à choix multiples sur le texte fourni. Retourne un JSON avec un tableau \"questions\" où chaque item a: question, options (4), answer.`;
  const prompt = `${systemPrompt}\n\n---\n${sectionText.slice(0, 6000)}\n---`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStart = text.indexOf('{');
    const json = JSON.parse(text.slice(jsonStart));
    return NextResponse.json(json);
  } catch (e: any) {
    console.error('Quiz generation error', e);
    return NextResponse.json({ error: 'Erreur génération' }, { status: 500 });
  }
}
