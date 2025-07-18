'use client';

import React from 'react';

interface PasswordStrengthProps {
  password?: string;
}

const validatePassword = (password: string) => {
  const criteria = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/g.test(password),
  };
  const score = Object.values(criteria).filter(Boolean).length;
  return { criteria, score, isValid: score >= 4 };
};

const StrengthIndicator = ({ valid, text }: { valid: boolean; text: string }) => (
  <li className={`flex items-center ${valid ? 'text-green-600' : 'text-gray-500'}`}>
    {valid ? (
      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    {text}
  </li>
);

export const PasswordStrength = ({ password = '' }: PasswordStrengthProps) => {
  if (!password) return null;

  const { criteria, score } = validatePassword(password);

  const getStrengthLabel = () => {
    if (score < 3) return 'Faible';
    if (score === 3) return 'Moyen';
    if (score === 4) return 'Bon';
    return 'Excellent';
  };

  const getStrengthColor = () => {
    if (score < 3) return 'bg-red-500';
    if (score === 3) return 'bg-yellow-500';
    if (score === 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-gray-500">Sécurité du mot de passe:</div>
        <div className="text-xs font-medium">{getStrengthLabel()}</div>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()}`}
          style={{ width: `${(score / 5) * 100}%` }}
        ></div>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <StrengthIndicator valid={criteria.length} text="Au moins 8 caractères" />
        <StrengthIndicator valid={criteria.lowercase} text="Une minuscule" />
        <StrengthIndicator valid={criteria.uppercase} text="Une majuscule" />
        <StrengthIndicator valid={criteria.number} text="Un chiffre" />
        <StrengthIndicator valid={criteria.special} text="Un caractère spécial" />
      </ul>
    </div>
  );
};
