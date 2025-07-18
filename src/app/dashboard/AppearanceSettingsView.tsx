"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const AppearanceSettingsView = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  const themes = [
    { name: 'Clair', value: 'light' },
    { name: 'Sombre', value: 'dark' },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">Apparence</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Thème</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choisissez l'apparence de l'application.</p>
        </div>
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex space-x-2 bg-slate-200 dark:bg-slate-700 p-1.5 rounded-xl">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                  theme === t.value
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-900/60'
                }`}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
