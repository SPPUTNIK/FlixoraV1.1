'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/languageStore';

export const SimpleSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Navigate to search results or trigger search
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsLoading(false);
    }
  }, [searchQuery, router]);

  return (
    <form onSubmit={handleSearch} className="relative">
      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input
        type="text"
        placeholder={language === 'fr' ? 'Rechercher des films par titre...' : 'Search movies by title...'}
        className="input-field pl-10 pr-10 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 py-2"
        value={searchQuery}
        onChange={(e) => handleSearchInputChange(e.target.value)}
      />
      {isLoading && searchQuery.length > 2 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
      {searchQuery.length > 0 && !isLoading && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          onClick={clearSearch}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </form>
  );
};
