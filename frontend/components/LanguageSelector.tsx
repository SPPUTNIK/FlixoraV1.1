'use client';

import { useLanguageStore } from '@/store/languageStore';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();

  console.log('🌍 LanguageSelector: Rendering with language:', language);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">Language:</span>
      <button
        onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
        className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {language === 'en' ? 'EN → FR' : 'FR → EN'}
      </button>
    </div>
  );
}

export default LanguageSelector;