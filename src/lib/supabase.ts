import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fonction pour vérifier si Supabase est configuré
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Fonction pour obtenir la configuration (pour debug)
export function getSupabaseConfig() {
  return {
    configured: isSupabaseConfigured(),
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Non définie',
    hasAnonKey: !!supabaseAnonKey,
  }
}

// Types pour l'authentification
export interface User {
  id: string
  email: string
  user_metadata: {
    firstName?: string
    lastName?: string
    full_name?: string
  }
}

export interface AuthError {
  message: string
  status?: number
}

// Types pour les decks
export interface Deck {
  id: string
  type: 'deck'
  name: string
  created_at: string
  modified_at: string
  status: 'completed' | 'in_progress' | 'not_started'
  user_id: string
  parent_id: string | null
  original_content?: string
  // Nouvelles colonnes pour les PDFs
  pdf_file_name?: string
  pdf_file_path?: string
  pdf_file_size?: number
  pdf_upload_date?: string
}

// Types pour les messages de conversation avec l'IA
export interface AIMessage {
  id?: string
  deck_id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: string
  user_id: string
}

// Fonctions d'authentification
export const auth = {
  // Inscription
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          full_name: `${firstName} ${lastName}`,
        },
      },
    })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data
  },

  // Connexion
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  },

  // Obtenir l'utilisateur actuel
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return user
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user as User | null)
    })
  },
}

// Fonctions pour les decks
export const decks = {
  // Récupérer tous les decks de l'utilisateur
  async getDecks(userId: string): Promise<Deck[]> {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des decks:', error);
      throw error;
    }

    return data || [];
  },

  // Créer un nouveau deck
  async createDeck(
    deck: Omit<Deck, 'id' | 'created_at' | 'modified_at'>
  ): Promise<Deck> {
    const { data, error } = await supabase
      .from('decks')
      .insert({ 
        ...deck,
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du deck:', error);
      throw error;
    }

    return data;
  },

  // Mettre à jour un deck
  async updateDeck(deckId: string, updates: Partial<Deck>): Promise<Deck> {
    const { data, error } = await supabase
      .from('decks')
      .update(updates)
      .eq('id', deckId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du deck:', error);
      throw error;
    }

    return data;
  },

  // Supprimer un deck
  async deleteDeck(deckId: string): Promise<void> {
    console.log(`[deleteDeck] Début de la suppression du deck ${deckId}`);
    
    try {
      // D'abord, vérifier si le deck existe
      console.log(`[deleteDeck] Vérification de l'existence du deck ${deckId}`);
      const { data: deckExists, error: deckExistsError } = await supabase
        .from('decks')
        .select('id, name, pdf_file_path')
        .eq('id', deckId)
        .single();
      
      if (deckExistsError) {
        console.error(`[deleteDeck] Erreur lors de la vérification du deck ${deckId}:`, deckExistsError);
        throw new Error(`Erreur lors de la vérification du deck: ${deckExistsError.message}`);
      }
      
      if (!deckExists) {
        const errorMsg = `[deleteDeck] Le deck ${deckId} n'existe pas`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log(`[deleteDeck] Deck trouvé:`, deckExists);
      
      // Supprimer d'abord le fichier PDF s'il existe
      if (deckExists.pdf_file_path) {
        console.log(`[deleteDeck] Tentative de suppression du fichier PDF: ${deckExists.pdf_file_path}`);
        const { error: storageError } = await supabase
          .storage
          .from('pdfs')
          .remove([deckExists.pdf_file_path]);
          
        if (storageError) {
          console.warn(`[deleteDeck] Avertissement: Impossible de supprimer le PDF ${deckExists.pdf_file_path}:`, storageError.message);
          // On continue même en cas d'échec de suppression du PDF
        } else {
          console.log(`[deleteDeck] Fichier PDF ${deckExists.pdf_file_path} supprimé avec succès`);
        }
      }
      
      // Ensuite supprimer le deck de la base de données
      console.log(`[deleteDeck] Tentative de suppression du deck ${deckId} de la base de données`);
      const { error: deleteDeckError } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId);
      
      if (deleteDeckError) {
        console.error('[deleteDeck] Erreur lors de la suppression du deck:', JSON.stringify(deleteDeckError, null, 2));
        throw new Error(`Erreur lors de la suppression du deck: ${deleteDeckError.message}`);
      }
      
      console.log(`[deleteDeck] Deck ${deckId} supprimé avec succès de la base de données`);
      
    } catch (error) {
      console.error('[deleteDeck] Erreur critique lors de la suppression du deck:', error);
      throw error; // Renvoyer l'erreur pour qu'elle soit gérée par l'appelant
    }
  },

  // Uploader un PDF et mettre à jour le deck
  async uploadPDF(deckId: string, file: File, userId: string): Promise<string> {
    // Nettoyer le nom du fichier pour le rendre compatible avec Supabase Storage
    const sanitizeFileName = (fileName: string): string => {
      return fileName
        .normalize('NFD') // Sépare les accents des lettres
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/\s+/g, '_') // Remplace les espaces par des underscores
        .replace(/[^a-zA-Z0-9_.-]/g, ''); // Supprime les caractères non autorisés
    };

    const sanitizedFileName = sanitizeFileName(file.name);
    const filePath = `${userId}/${deckId}/${sanitizedFileName}`;

    // Uploader le fichier
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Erreur lors de l\'upload du PDF:', JSON.stringify(uploadError, null, 2));
      throw new Error(`Erreur d'upload PDF: ${uploadError.message}`);
    }

    // Mettre à jour la table des decks avec les infos du PDF
    const { error: updateError } = await supabase
      .from('decks')
      .update({
        pdf_file_path: filePath, // Utiliser le chemin avec le nom nettoyé
        pdf_file_name: file.name, // Conserver le nom original pour l'affichage
        pdf_file_size: file.size,
        pdf_upload_date: new Date().toISOString(),
        modified_at: new Date().toISOString(),
      })
      .eq('id', deckId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du deck:', updateError);
      // Tenter de supprimer le fichier uploadé en cas d'erreur
      await supabase.storage.from('pdfs').remove([filePath]);
      throw updateError;
    }

    return filePath;
  },

  // Obtenir l'URL signée pour un PDF
  async getSignedPDFUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('pdfs')
      .createSignedUrl(filePath, 3600); // URL valide pour 1 heure

    if (error) {
      console.error('Erreur lors de la création de l\'URL signée:', error);
      throw error;
    }

    return data.signedUrl;
  },

  // Supprimer un PDF associé à un deck
  async removePDF(deckId: string): Promise<void> {
    // 1. Récupérer le chemin du fichier PDF depuis la table 'decks'
    const { data: deckData, error: fetchError } = await supabase
      .from('decks')
      .select('pdf_file_path')
      .eq('id', deckId)
      .single();

    if (fetchError || !deckData) {
      console.error('Deck non trouvé ou erreur de récupération:', fetchError?.message);
      throw new Error('Deck non trouvé.');
    }

    const filePath = deckData.pdf_file_path;

    if (!filePath) {
      console.warn('Aucun PDF associé à ce deck.');
      return; // Pas de fichier à supprimer
    }

    // 2. Supprimer le fichier du Supabase Storage
    const { error: storageError } = await supabase.storage.from('pdfs').remove([filePath]);
    if (storageError) {
      console.error('Erreur lors de la suppression du fichier PDF du storage:', storageError.message);
      throw storageError;
    }

    // 3. Mettre à jour la table 'decks' pour retirer les informations du PDF
    const { error: updateError } = await supabase
      .from('decks')
      .update({
        pdf_file_path: null,
        pdf_file_name: null,
        pdf_file_size: null,
        pdf_upload_date: null,
        modified_at: new Date().toISOString(),
      })
      .eq('id', deckId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du deck après suppression du PDF:', updateError.message);
      // Note : à ce stade, le fichier est supprimé mais le deck n'est pas à jour.
      // Une gestion de compensation pourrait être nécessaire dans un cas de production robuste.
      throw updateError;
    }
  },
};

// Fonctions pour les messages IA
export const aiMessages = {
  // Vérifier si la table ai_messages existe
  async checkTableExists(): Promise<boolean> {
    try {
      // Tenter de récupérer un seul enregistrement pour vérifier si la table existe
      const { error } = await supabase
        .from('ai_messages')
        .select('id')
        .limit(1);

      // Si l'erreur contient "relation does not exist", la table n'existe pas
      if (error && error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
        console.warn('La table ai_messages n\'existe pas encore. Veuillez la créer dans la console Supabase.');
        return false;
      }
      
      return true;
    } catch (err) {
      console.warn('Erreur lors de la vérification de la table ai_messages:', err);
      return false;
    }
  },
  
  // Récupérer tous les messages d'un deck
  async getMessages(deckId: string): Promise<AIMessage[]> {
    try {
      // Vérifier d'abord si la table existe
      const tableExists = await this.checkTableExists();
      if (!tableExists) return [];
      
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('deck_id', deckId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception lors de la récupération des messages:', err);
      return [];
    }
  },

  // Ajouter un nouveau message
  async addMessage(message: Omit<AIMessage, 'id'>): Promise<AIMessage | null> {
    try {
      // Vérifier d'abord si la table existe
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        console.warn('Impossible d\'ajouter le message: la table ai_messages n\'existe pas');
        return null;
      }
      
      const { data, error } = await supabase
        .from('ai_messages')
        .insert(message)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du message:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception lors de l\'ajout du message:', err);
      return null;
    }
  },

  // Supprimer tous les messages d'un deck
  async deleteMessages(deckId: string): Promise<boolean> {
    try {
      // Vérifier d'abord si la table existe
      const tableExists = await this.checkTableExists();
      if (!tableExists) return true; // Rien à supprimer si la table n'existe pas
      
      const { error } = await supabase
        .from('ai_messages')
        .delete()
        .eq('deck_id', deckId);

      if (error) {
        console.error('Erreur lors de la suppression des messages:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception lors de la suppression des messages:', err);
      return false;
    }
  }
};

export default supabase