
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Locale } from '@/lib/types'; // Import Locale type
export type { Locale }; // Re-export for convenience

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('vi'); // Default to Vietnamese

  useEffect(() => {
    // Attempt to get saved locale from localStorage
    const savedLocale = localStorage.getItem('app-locale') as Locale | null;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
      setLocale(savedLocale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('app-locale', newLocale); // Save to localStorage
  };
  
  // Effect to update document lang attribute
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
