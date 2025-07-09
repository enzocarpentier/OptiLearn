'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActivePage = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center group">
            <span className={`text-3xl font-bold transition-all duration-300 group-hover:text-primary-600 ${
              isScrolled ? 'text-gray-900' : 'text-gray-900'
            }`}>
              OptiLearn
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className={`hidden sm:block text-sm transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600' : 'text-gray-700'
                }`}>
                  Bonjour, {currentUser.displayName?.split(' ')[0] || currentUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isScrolled 
                      ? 'text-gray-700 bg-white/80 border border-gray-300 hover:bg-white hover:border-gray-400' 
                      : 'text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:border-gray-300'
                  }`}
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-gray-800 hover:text-gray-900'
                  }`}
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-bold text-white bg-primary-600 border border-primary-600 rounded-full hover:bg-primary-700 hover:border-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors duration-200 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
              }`}
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className={`pt-4 pb-2 space-y-2 ${
            isScrolled 
              ? 'bg-white/90 backdrop-blur-md rounded-lg border border-gray-200/50 mt-2 p-4' 
              : 'bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/30 mt-2 p-4'
          }`}>
            {currentUser && (
              <>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </>
            )}

            {!currentUser && (
              <div className="pt-2 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="block px-3 py-2 text-base font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 