'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fonction de validation du mot de passe
  const validatePassword = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(criteria).filter(Boolean).length;
    return { criteria, score, isValid: score === 5 };
  };

  const passwordValidation = validatePassword(password);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      return setError('Le mot de passe ne respecte pas tous les critères de sécurité.');
    }

    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, firstName, lastName);
      router.push('/dashboard');
    } catch (error) {
      setError('Échec de la création du compte. Cet e-mail est peut-être déjà utilisé.');
    }

    setLoading(false);
  };
  
  const preventDefault = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">OptiLearn</h1>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Rejoignez-nous pour optimiser votre apprentissage.
            </p>
          </div>
        
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md text-sm">
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-400 text-base"
                    placeholder="Enzo"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-400 text-base"
                    placeholder="Carpentier"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-400 text-base"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-400 text-base"
                    placeholder="••••••••"
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
                
                {/* Indicateur de force du mot de passe */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Force:</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordValidation.score <= 2 ? 'bg-red-500' :
                            passwordValidation.score <= 3 ? 'bg-yellow-500' :
                            passwordValidation.score <= 4 ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${
                        passwordValidation.score <= 2 ? 'text-red-600' :
                        passwordValidation.score <= 3 ? 'text-yellow-600' :
                        passwordValidation.score <= 4 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {passwordValidation.score <= 2 ? 'Faible' :
                         passwordValidation.score <= 3 ? 'Moyen' :
                         passwordValidation.score <= 4 ? 'Bon' :
                         'Excellent'}
                      </span>
                    </div>
                    
                    {/* Critères de validation */}
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className={`flex items-center space-x-2 ${
                        passwordValidation.criteria.length ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <span className="w-3 text-center">
                          {passwordValidation.criteria.length ? '✓' : '○'}
                        </span>
                        <span>Au moins 8 caractères</span>
                      </div>
                      
                      <div className={`flex items-center space-x-2 ${
                        passwordValidation.criteria.lowercase ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <span className="w-3 text-center">
                          {passwordValidation.criteria.lowercase ? '✓' : '○'}
                        </span>
                        <span>Une lettre minuscule (a-z)</span>
                      </div>
                      
                      <div className={`flex items-center space-x-2 ${
                        passwordValidation.criteria.uppercase ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <span className="w-3 text-center">
                          {passwordValidation.criteria.uppercase ? '✓' : '○'}
                        </span>
                        <span>Une lettre majuscule (A-Z)</span>
                      </div>
                      
                      <div className={`flex items-center space-x-2 ${
                        passwordValidation.criteria.number ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <span className="w-3 text-center">
                          {passwordValidation.criteria.number ? '✓' : '○'}
                        </span>
                        <span>Un chiffre (0-9)</span>
                      </div>
                      
                      <div className={`flex items-center space-x-2 ${
                        passwordValidation.criteria.special ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <span className="w-3 text-center">
                          {passwordValidation.criteria.special ? '✓' : '○'}
                        </span>
                        <span>Un caractère spécial (!@#$%^&*...)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-400 text-base"
                    placeholder="••••••••"
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
              </div>
            </div>

            <div className="flex items-start text-sm">
              <div className="flex items-center h-5">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-gray-600">
                J'accepte les{' '}
                <a href="#" onClick={preventDefault} className="font-medium text-primary-600 hover:underline">
                  conditions d'utilisation
                </a>
                .
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="font-semibold text-primary-600 hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 