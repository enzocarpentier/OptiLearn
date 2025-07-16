'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';

export default function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  const { signup } = useAuth();
  const { switchTo, closeModal } = useAuthModal();

  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    const score = Object.values(criteria).filter(Boolean).length;
    return { criteria, score, isValid: score >= 4 };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValidation.isValid) {
      return setError('Le mot de passe doit avoir au moins un niveau "Bon" pour être accepté.');
    }
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password, firstName, lastName);
      setShowEmailConfirmation(true);
    } catch {
      setError('Une erreur est survenue lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  if (showEmailConfirmation) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vérifiez votre email</h2>
            <p className="text-gray-600 mb-6">Nous venons d'envoyer un email de confirmation à <strong>{email}</strong></p>
            <button 
                onClick={() => closeModal()}
                className="w-full px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
                Terminé
            </button>
        </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-500">Rejoignez-nous pour optimiser votre apprentissage.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-md text-sm mb-3">
            <p>{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input id="firstName" name="firstName" type="text" autoComplete="given-name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input id="lastName" name="lastName" type="text" autoComplete="family-name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
        </div>
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
                <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete="new-password" 
                    required 
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
            {password && (
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-500">Sécurité du mot de passe:</div>
                        <div className="text-xs font-medium">
                            {passwordValidation.score < 3 && "Faible"}
                            {passwordValidation.score === 3 && "Moyen"}
                            {passwordValidation.score === 4 && "Bon"}
                            {passwordValidation.score === 5 && "Excellent"}
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${passwordValidation.score < 3 ? 'bg-red-500' : passwordValidation.score === 3 ? 'bg-yellow-500' : passwordValidation.score === 4 ? 'bg-green-500' : 'bg-green-600'}`}
                            style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                        ></div>
                    </div>
                    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <li className={`flex items-center ${passwordValidation.criteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordValidation.criteria.length ? (
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            Au moins 8 caractères
                        </li>
                        <li className={`flex items-center ${passwordValidation.criteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordValidation.criteria.lowercase ? (
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            Une minuscule
                        </li>
                        <li className={`flex items-center ${passwordValidation.criteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordValidation.criteria.uppercase ? (
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            Une majuscule
                        </li>
                        <li className={`flex items-center ${passwordValidation.criteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordValidation.criteria.number ? (
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            Un chiffre
                        </li>
                        <li className={`flex items-center ${passwordValidation.criteria.special ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordValidation.criteria.special ? (
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            Un caractère spécial
                        </li>
                    </ul>
                </div>
            )}
        </div>
        <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <div className="relative">
                <input 
                    id="confirm-password" 
                    name="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    autoComplete="new-password" 
                    required 
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas</p>
            )}
        </div>
        <div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <button onClick={() => switchTo('login')} className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Connectez-vous
          </button>
        </p>
      </div>
    </>
  );
}
