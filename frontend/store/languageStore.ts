import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
  syncWithUserPreference: (userLang?: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      syncWithUserPreference: (userLang?: string) => {
        if (userLang && userLang !== get().language) {
          set({ language: userLang });
        }
      },
    }),
    {
      name: 'language-storage',
    }
  )
);