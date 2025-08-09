import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Locale } from '@/lib/i18n';

// Translation dictionaries
const translations = {
  en: () => import('@/locales/en.json').then(module => module.default),
  fr: () => import('@/locales/fr.json').then(module => module.default),
};

// Cache for loaded translations
const translationCache: Record<string, any> = {};

export function useTranslation() {
  const { language } = useLanguageStore();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get nested value from object using dot notation
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path;
  };
  
  // Translation function
  const t = (key: string): string => {
    const currentLang = language as Locale;
    const cachedTranslations = translationCache[currentLang];
    
    if (cachedTranslations) {
      return getNestedValue(cachedTranslations, key);
    }
    
    // If translations aren't loaded yet, return the key
    return key;
  };
  
  // Load translations for current language
  const loadTranslations = async (lang: Locale) => {
    if (!translationCache[lang] && translations[lang]) {
      try {
        translationCache[lang] = await translations[lang]();
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        // Fallback to English
        if (lang !== 'en' && translations.en) {
          translationCache[lang] = await translations.en();
        }
      }
    }
  };

  // Load translations when language changes
  useEffect(() => {
    const loadAndSetTranslations = async () => {
      setIsLoaded(false);
      await loadTranslations(language as Locale);
      setIsLoaded(true);
    };
    
    loadAndSetTranslations();
  }, [language]);
  
  return { t, language: language as Locale, isLoaded };
}