import { create } from 'zustand';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
  syncWithUserPreference: (userLang?: string) => void;
}

// Simplified language store without persistence for debugging
export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  setLanguage: (lang: string) => {
    console.log('🌍 Language Store: Setting language to:', lang);
    set({ language: lang });
    console.log('🌍 Language Store: New state:', get());
  },
  syncWithUserPreference: (userLang?: string) => {
    if (userLang && userLang !== get().language) {
      console.log('🌍 Language Store: Syncing with user preference:', userLang);
      set({ language: userLang });
    }
  },
}));