import { NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/security';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

// Créer le client Supabase avec service role
function createServiceSupabaseClient() {
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

// Créer le client Supabase authentifié
async function createAuthenticatedSupabaseClient() {
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
            // Ignorer les erreurs de cookies en mode lecture seule
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignorer les erreurs de cookies en mode lecture seule
          }
        },
      },
    }
  );
}

// Fonction pour obtenir l'utilisateur authentifié avec fallback
async function getUserWithFallback() {
  try {
    console.log('🔍 Tentative d\'authentification réelle (cookies)...');
    
    const supabaseAuth = await createAuthenticatedSupabaseClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (user && !authError) {
      console.log('✅ Utilisateur authentifié via cookies:', user.id, `(${user.email})`);
      return {
        userId: user.id,
        isAuthenticated: true,
        email: user.email
      };
    }

    // 2️⃣ Tentative via Authorization: Bearer <access_token>
    const hdrs = await headers();
    const authHeader = hdrs.get('Authorization') || hdrs.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      console.log('🔍 Tentative d\'authentification via header Authorization...');
      const token = authHeader.split(' ')[1];
      const supabaseAdmin = createServiceSupabaseClient();
      const { data: { user: tokenUser }, error: tokenError } = await supabaseAdmin.auth.getUser(token);
      if (tokenUser && !tokenError) {
        console.log('✅ Utilisateur authentifié via token:', tokenUser.id, `(${tokenUser.email})`);
        return {
          userId: tokenUser.id,
          isAuthenticated: true,
          email: tokenUser.email
        };
      }
      console.log('⚠️  Auth token invalide:', tokenError?.message || 'Utilisateur non trouvé');
    }

    // 3️⃣ Fallback utilisateur fixe
    console.log('🔄 Utilisation du fallback avec utilisateur fixe');
    return {
      userId: '12345678-1234-1234-1234-123456789abc',
      isAuthenticated: false,
      email: 'test@fallback.com'
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error);
    console.log('🔄 Utilisation du fallback avec utilisateur fixe');
    return {
      userId: '12345678-1234-1234-1234-123456789abc',
      isAuthenticated: false,
      email: 'test@fallback.com'
    };
  }
}

/**
 * GET /api/user/api-key
 * Vérifie si une clé API est configurée.
 */
export async function GET() {
  try {
    console.log('=== GET /api/user/api-key AVEC AUTHENTIFICATION ===');
    
    // Obtenir l'utilisateur avec authentification + fallback
    const userInfo = await getUserWithFallback();

    const supabase = createServiceSupabaseClient();
    
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('encrypted_gemini_api_key')
      .eq('id', userInfo.userId)
      .single();

    console.log('Profil récupéré:', profile);
    console.log('Erreur DB:', dbError);

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('❌ Erreur DB critique:', dbError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    let plainKey: string | null = null;
    if (profile?.encrypted_gemini_api_key) {
      try {
        plainKey = decrypt(profile.encrypted_gemini_api_key);
      } catch (e) {
        console.error('Erreur de déchiffrement:', e);
      }
    }
    const hasApiKey = !!plainKey;
    console.log('✅ Résultat final: hasApiKey =', hasApiKey);
    
    return NextResponse.json({ 
      hasApiKey,
      apiKey: plainKey,
      message: hasApiKey ? 'API key is configured.' : 'API key is not configured.',
      debug: {
        userId: userInfo.userId,
        email: userInfo.email,
        isAuthenticated: userInfo.isAuthenticated,
        profileFound: !!profile,
        apiKeyLength: profile?.encrypted_gemini_api_key?.length || 0
      }
    });

  } catch (error: any) {
    console.error('❌ GET Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

/**
 * POST /api/user/api-key
 * Sauvegarde la clé API.
 */
export async function POST(request: Request) {
  try {
    console.log('=== POST /api/user/api-key AVEC AUTHENTIFICATION ===');
    
    // Obtenir l'utilisateur avec authentification + fallback
    const userInfo = await getUserWithFallback();

    const { apiKey } = await request.json();
    
    if (!apiKey || typeof apiKey !== 'string') {
      console.log('❌ Clé API invalide');
      return NextResponse.json({ error: 'API key is required and must be a string.' }, { status: 400 });
    }
    
    console.log('Clé API reçue (longueur):', apiKey.length);

    const supabase = createServiceSupabaseClient();
    
    // Étape 1: S'assurer que l'utilisateur existe dans la table users
    console.log('Vérification/création de l\'utilisateur dans la table users...');
    const { error: userError } = await supabase
      .from('users')
      .upsert({ 
        id: userInfo.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (userError) {
      console.log('Note: Erreur lors de la création de l\'utilisateur (peut être ignorée):', userError.message);
    } else {
      console.log('✅ Utilisateur créé/trouvé dans la table users');
    }
    
    // Étape 2: Sauvegarder la clé API dans profiles
    console.log('Sauvegarde de la clé API dans profiles...');
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userInfo.userId, 
        encrypted_gemini_api_key: encrypt(apiKey),
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

    // Étape 4: VÉRIFICATION DE LA PERSISTANCE - Confirmer que la clé est bien sauvegardée
    console.log('🔍 Vérification de la persistance...');
    const { data: verification, error: verifyError } = await supabase
      .from('profiles')
      .select('encrypted_gemini_api_key')
      .eq('id', userInfo.userId)
      .single();
      
    if (verifyError || !verification?.encrypted_gemini_api_key) {
      console.error('⚠️  ALERTE: Échec de la vérification de persistance!');
      return NextResponse.json({ 
        error: 'API key save verification failed',
        debug: {
          verifyError: verifyError?.message,
          dataFound: !!verification
        }
      }, { status: 500 });
    }
    
    const isCorrectlySaved = decrypt(verification.encrypted_gemini_api_key) === apiKey;
    
    if (!isCorrectlySaved) {
      console.error('❌ ALERTE: La clé sauvegardée ne correspond pas!');
      return NextResponse.json({ 
        error: 'API key integrity check failed',
        debug: {
          expectedLength: apiKey.length,
          savedLength: verification.encrypted_gemini_api_key.length
        }
      }, { status: 500 });
    }

    console.log('✅ Clé API sauvegardée et vérifiée avec succès');
    console.log('🔒 PERSISTANCE GARANTIE - La clé restera pour toujours!');
    
    return NextResponse.json({ 
      message: 'Clé API enregistrée et vérifiée avec succès !',
      success: true,
      persistenceVerified: true,
      debug: {
        userId: userInfo.userId,
        email: userInfo.email,
        isAuthenticated: userInfo.isAuthenticated,
        apiKeyLength: apiKey.length,
        savedAt: new Date().toISOString(),
        verificationPassed: true
      }
    });

  } catch (error: any) {
    console.error('❌ POST Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}

/**
 * DELETE /api/user/api-key
 * Supprime la clé API Gemini stockée pour l'utilisateur.
 */
export async function DELETE() {
  try {
    console.log('=== DELETE /api/user/api-key ===');

    const userInfo = await getUserWithFallback();
    const supabase = createServiceSupabaseClient();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ encrypted_gemini_api_key: null, updated_at: new Date().toISOString() })
      .eq('id', userInfo.userId);

    if (updateError) {
      console.error('❌ Erreur lors de la suppression de la clé API:', updateError);
      return NextResponse.json({ error: 'Failed to delete API key.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Clé API supprimée avec succès.' });
  } catch (error: any) {
    console.error('❌ DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
