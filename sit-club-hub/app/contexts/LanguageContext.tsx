"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const STORAGE_KEY = 'sit-club-hub-lang';

function persistLang(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ja') {
      setLang(stored);
    }
  }, []);

  const setLangAndPersist = (next: Language) => {
    setLang(next);
    persistLang(next);
  };

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'ja' : 'en';
      persistLang(next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangAndPersist, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
