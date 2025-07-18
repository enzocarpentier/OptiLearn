import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Pour AES, c'est toujours 16
const AUTH_TAG_LENGTH = 16;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.error('***********************************************************************************');
  console.error('* ERREUR CRITIQUE: La variable ENCRYPTION_KEY est manquante ou invalide.         *');
  console.error('* Assurez-vous qu\'elle est définie dans .env.local et fait 32 caractères.      *');
  console.error('***********************************************************************************');
  // Ne pas planter le serveur, mais empêcher le chiffrement de fonctionner.
  // Cela permet de garder le serveur en marche pour le débogage.
}

const key: Buffer | null =
  typeof ENCRYPTION_KEY === 'string' && ENCRYPTION_KEY.length === 32
    ? Buffer.from(ENCRYPTION_KEY, 'utf-8')
    : null;

/**
 * Chiffre un texte en utilisant AES-256-GCM.
 * Le IV et l'auth tag sont préfixés au texte chiffré.
 */
export function encrypt(text: string): string {
  if (!key) {
    console.error('Chiffrement impossible: ENCRYPTION_KEY n\'est pas configurée correctement.');
    return ''; // Retourner une chaîne vide ou gérer l'erreur de manière appropriée
  }
  if (!key) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Concatène iv, authTag et le texte chiffré pour un stockage facile
  return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

/**
 * Déchiffre un texte chiffré avec AES-256-GCM.
 * Attend le format : iv + authTag + encryptedText.
 */
export function decrypt(encryptedText: string): string {
  if (!key) return '';
  const buffer = Buffer.from(encryptedText, 'hex');
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = buffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString('utf8');
}
