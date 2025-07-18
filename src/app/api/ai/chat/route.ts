import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/security';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Permet de streamer la réponse de l'IA
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { prompt, context } = await request.json(); // `context` sera le texte de votre document

  if (!prompt) {
    return new NextResponse(JSON.stringify({ error: 'Un prompt est requis.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  async function getUserWithFallback() {
    // 1️⃣ Via cookies (session)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      return { userId: session.user.id, email: session.user.email };
    }

    // 2️⃣ Via header Authorization
    const hdrs = request.headers;
    const authHeader = hdrs.get('Authorization') || hdrs.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data: { user } } = await admin.auth.getUser(token);
      if (user) return { userId: user.id, email: user.email };
    }

    // 3️⃣ Fallback
    return { userId: '12345678-1234-1234-1234-123456789abc', email: null };
  }

  const userInfo = await getUserWithFallback();

  try {
    // 1. Récupérer la clé API chiffrée de l'utilisateur
    const { data: profile, error: profileError } = await serviceSupabase
      .from('profiles')
      .select('encrypted_gemini_api_key')
      .eq('id', userInfo.userId)
      .single();

    if (profileError) throw new Error('Profil utilisateur introuvable.');

    const encryptedApiKey = profile?.encrypted_gemini_api_key;

    if (!encryptedApiKey) {
      return new NextResponse(JSON.stringify({ error: 'Clé API Gemini non configurée. Veuillez l\'ajouter dans vos paramètres.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Déchiffrer la clé
    const apiKey = decrypt(encryptedApiKey);
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
    });

    // 3. Préparer le prompt pour l'IA
    const systemPrompt = `Vous êtes OptiLearn, un assistant pédagogique expert qui aide les apprenants à comprendre et assimiler le contenu de leur deck. Vos réponses doivent :\n- être rédigées en français clair, concis et pédagogique\n- être directement liées au contexte fourni\n- s'adapter au niveau de l'utilisateur\n- ne jamais mentionner que vous êtes un modèle d'IA ni faire référence à votre formation\n- indiquer poliment si la réponse n'est pas trouvée dans le contexte et proposer des pistes de recherche supplémentaires.`;

    const fullPrompt = `${systemPrompt}\n\nContexte du document:\n---\n${context || 'Aucun document fourni.'}\n---\n\nQuestion de l'utilisateur:\n${prompt}`;

    // 4. Appeler l'API Gemini et streamer la réponse
    const result = await model.generateContentStream(fullPrompt);

    // Transformer le stream de l'API Google en un stream de réponse standard
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error('Erreur de l\'API de chat IA:', error);

    // Détecter les erreurs d\'authentification Gemini
    const message: string = error?.message || '';
    const isInvalidKey = /api key|authentication|credentials|permission/i.test(message);
    if (isInvalidKey) {
      return new NextResponse(JSON.stringify({ error: 'invalid_api_key' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ error: 'Erreur interne du serveur lors de la communication avec l\'IA.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
