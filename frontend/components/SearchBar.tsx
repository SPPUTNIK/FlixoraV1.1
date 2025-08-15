import { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface SearchBarProps {
  searchQuery: string;
  isLoading: boolean;
  language: string;
  handleSearchInputChange: (value: string) => void;
  clearSearch: () => void;
  handleSearch: (e: FormEvent) => void;
}

export const SearchBar = ({ 
  searchQuery, 
  isLoading, 
  language, 
  handleSearchInputChange, 
  clearSearch, 
  handleSearch 
}: SearchBarProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <input
        type="text"
        placeholder={t('movies.searchMoviesPlaceholder')}
        className="input-field pl-10 pr-10 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={searchQuery}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchInputChange(e.target.value)}
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
    </div>
  );
};