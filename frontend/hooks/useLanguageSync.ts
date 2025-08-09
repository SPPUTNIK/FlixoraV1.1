import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export function useLanguageSync() {
  const { syncWithUserPreference } = useLanguageStore();

  useEffect(() => {
    // Since we removed authentication, we'll just sync with the stored language preference
    // The language store should handle browser language detection by default
    const browserLang = navigator.language.slice(0, 2);
    const supportedLanguages = ['en', 'fr'];
    const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';
    
    syncWithUserPreference(defaultLang);
  }, [syncWithUserPreference]);
}