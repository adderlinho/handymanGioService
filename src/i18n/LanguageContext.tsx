import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, SupportedLanguage, TranslationDict } from './translations';

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'gioService.language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>('es');

  useEffect(() => {
    const stored = (typeof window !== 'undefined') ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'es' || stored === 'en') {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, newLang);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const dict: TranslationDict = translations[lang] || {};
    const value = dict[key];

    if (typeof value === 'function') {
      return value(params);
    }

    if (typeof value === 'string') {
      return value;
    }

    // fallback to Spanish, then to key
    const fallback = translations['es'][key];
    if (typeof fallback === 'string') return fallback;
    if (typeof fallback === 'function') return fallback(params);

    return key; // safe fallback
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};

// Convenience hook for just translation
export const useTranslation = () => {
  const { t, lang, setLang } = useLanguage();
  return { t, lang, setLang };
};