import { useLanguageStore } from '@/store/languageStore';
import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: any;
}

// Static import approach for Next.js compatibility
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';

const translations: Record<string, Translations> = {
  en: enTranslations,
  fr: frTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  const [, forceUpdate] = useState(0);

  // Force re-render when language changes
  useEffect(() => {
    console.log('🔄 useTranslation: Language changed to:', language);
    forceUpdate(prev => prev + 1);
  }, [language]);

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations.en;
    
    if (!currentTranslations) {
      console.warn('⚠️ No translations available for language:', language);
      return key;
    }
    
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (value === undefined || typeof value !== 'string') {
      console.warn('⚠️ Translation missing for key:', key, 'in language:', language);
      return key;
    }
    
    console.log('✅ Translation:', key, '→', value, `(${language})`);
    return value;
  };

  return { t, language };
};