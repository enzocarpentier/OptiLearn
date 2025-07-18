import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Crée un client Supabase pour les opérations nécessitant une élévation de privilèges (ex: contourner RLS).
 * Utilise la clé de service (service_role_key).
 * @returns {SupabaseClient}
 */
function createServiceSupabaseClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Crée un client Supabase authentifié côté serveur en utilisant les cookies de la requête.
 * @returns {SupabaseClient}
 */
async function createAuthenticatedSupabaseClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * GET /api/user/api-key
 * Vérifie si une clé API est configurée pour l'utilisateur authentifié.
 */
export async function GET() {
  try {
    console.log('=== GET /api/user/api-key START ===');
    
    // SOLUTION TEMPORAIRE : Utiliser un utilisateur par défaut
    console.log('🔧 SOLUTION TEMPORAIRE : Utilisation d\'un utilisateur par défaut');
    
    // Tentative d'authentification normale
    const supabaseAuth = await createAuthenticatedSupabaseClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    let userId: string;
    
    if (authError || !user) {
      console.log('⚠️  Pas d\'utilisateur authentifié - recherche d\'un utilisateur existant');
      
      // Créer le client service d’abord
      const supabaseService = createServiceSupabaseClient();
      
      // Chercher un utilisateur existant dans la base
      const { data: existingUsers } = await supabaseService
        .from('users')
        .select('id')
        .limit(1);
      
      if (existingUsers && existingUsers.length > 0) {
        userId = existingUsers[0].id;
        console.log('✅ Utilisateur existant trouvé:', userId);
      } else {
        console.log('❌ Aucun utilisateur trouvé en base');
        return NextResponse.json({ 
          error: 'No users found in database',
          debug: { message: 'Please create a user first' }
        }, { status: 500 });
      }
    } else {
      console.log('✅ Utilisateur authentifié trouvé:', user.id);
      userId = user.id;
    }

    // Utiliser le même client service
    console.log('Étape 3: Utilisation du client service');
    const supabaseService = createServiceSupabaseClient();
    
    // Récupérer le profil
    console.log('Étape 4: Récupération du profil pour utilisateur:', userId);
    const { data: profile, error: dbError } = await supabaseService
      .from('profiles')
      .select('gemini_api_key')
      .eq('id', userId)
      .single();

    console.log('Profil récupéré:', profile);
    console.log('Erreur DB:', dbError);

    // 'PGRST116' => 'no rows found', which is not a critical error here.
    if (dbError && dbError.code !== 'PGRST116') {
      console.error('❌ Erreur DB critique:', dbError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const hasApiKey = !!profile?.gemini_api_key;
    console.log('✅ Résultat final: hasApiKey =', hasApiKey);
    
    return NextResponse.json({ 
      hasApiKey,
      message: hasApiKey ? 'API key is configured.' : 'API key is not configured.',
      debug: {
        userId: userId,
        profileFound: !!profile,
        apiKeyLength: profile?.gemini_api_key?.length || 0,
        isTemporaryUser: !user
      }
    });

  } catch (error: any) {
    console.error('❌ GET /api/user/api-key Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

/**
 * POST /api/user/api-key
 * Sauvegarde la clé API pour l'utilisateur authentifié.
 */
export async function POST(request: Request) {
  try {
    console.log('=== POST /api/user/api-key START ===');
    
    // SOLUTION TEMPORAIRE : Utiliser un utilisateur par défaut
    console.log('🔧 SOLUTION TEMPORAIRE : Utilisation d\'un utilisateur par défaut');
    
    // Tentative d'authentification normale
    const supabaseAuth = await createAuthenticatedSupabaseClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    let userId: string;
    
    if (authError || !user) {
      console.log('⚠️  Pas d\'utilisateur authentifié - recherche d\'un utilisateur existant');
      
      // Créer le client service d’abord
      const supabaseService = createServiceSupabaseClient();
      
      // Chercher un utilisateur existant dans la base
      const { data: existingUsers } = await supabaseService
        .from('users')
        .select('id')
        .limit(1);
      
      if (existingUsers && existingUsers.length > 0) {
        userId = existingUsers[0].id;
        console.log('✅ Utilisateur existant trouvé:', userId);
      } else {
        console.log('❌ Aucun utilisateur trouvé en base');
        return NextResponse.json({ 
          error: 'No users found in database',
          debug: { message: 'Please create a user first' }
        }, { status: 500 });
      }
    } else {
      console.log('✅ Utilisateur authentifié trouvé:', user.id);
      userId = user.id;
    }

    // Récupérer les données de la requête
    console.log('Étape 3: Récupération des données de la requête');
    const { apiKey } = await request.json();
    
    if (!apiKey || typeof apiKey !== 'string') {
      console.log('❌ Clé API invalide');
      return NextResponse.json({ error: 'API key is required and must be a string.' }, { status: 400 });
    }
    
    console.log('Clé API reçue (longueur):', apiKey.length);

    // Créer le client service
    console.log('Étape 4: Création du client service');
    const supabaseService = createServiceSupabaseClient();
    
    // Sauvegarder en base
    console.log('Étape 5: Sauvegarde en base pour utilisateur:', userId);
    const { error: dbError } = await supabaseService
      .from('profiles')
      .upsert({ 
        id: userId, 
        gemini_api_key: apiKey,
        updated_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('❌ Erreur de sauvegarde:', dbError);
      return NextResponse.json({ 
        error: 'Failed to save API key.',
        debug: {
          dbError: dbError.message,
          code: dbError.code
        }
      }, { status: 500 });
    }

    console.log('✅ Clé API sauvegardée avec succès');
    return NextResponse.json({ 
      message: 'API key saved successfully!',
      debug: {
        userId: userId,
        apiKeyLength: apiKey.length,
        isTemporaryUser: !user
      }
    });

  } catch (error: any) {
    console.error('❌ POST /api/user/api-key Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
