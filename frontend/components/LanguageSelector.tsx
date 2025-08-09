'use client';

import { useLanguageStore } from '@/store/languageStore';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-gray-800 text-white rounded-md px-2 py-1"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

// Keep default export for backward compatibility
export default LanguageSelector;