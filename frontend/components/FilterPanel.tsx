import { ChangeEvent, FormEvent } from 'react';
import { SearchBar } from './SearchBar';
import { useTranslation } from '@/hooks/useTranslation';

interface FilterPanelProps {
  isFilterOpen: boolean;
  language: string;
  searchQuery: string;
  isLoading: boolean;
  yearFilter: string;
  movieLanguageFilter: string;
  genreFilter: string;
  minRatingFilter: number;
  maxRatingFilter: number;
  sortByFilter: string;
  handleSearchInputChange: (value: string) => void;
  clearSearch: () => void;
  handleSearch: (e: FormEvent) => void;
  setYearFilter: (value: string) => void;
  setMovieLanguageFilter: (value: string) => void;
  setGenreFilter: (value: string) => void;
  setMinRatingFilter: (value: number) => void;
  setMaxRatingFilter: (value: number) => void;
  setSortByFilter: (value: string) => void;
  clearAllFilters: () => void;
}

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
];

const getSortOptionLabel = (value: string, t: (key: string) => string) => {
  const sortMap: { [key: string]: string } = {
    'popularity.desc': t('popularityHighToLow'),
    'popularity.asc': t('popularityLowToHigh'),
    'release_date.desc': t('releaseDateNewest'),
    'release_date.asc': t('releaseDateOldest'),
    'vote_average.desc': t('ratingHighToLow'),
    'vote_average.asc': t('ratingLowToHigh'),
    'title.asc': t('titleAZ'),
    'title.desc': t('titleZA'),
  };
  return sortMap[value] || value;
};

const sortOptions = [
  'popularity.desc',
  'popularity.asc',
  'release_date.desc',
  'release_date.asc',
  'vote_average.desc',
  'vote_average.asc',
  'title.asc',
  'title.desc',
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export const FilterPanel = ({
  isFilterOpen,
  language,
  searchQuery,
  isLoading,
  yearFilter,
  movieLanguageFilter,
  genreFilter,
  minRatingFilter,
  maxRatingFilter,
  sortByFilter,
  handleSearchInputChange,
  clearSearch,
  handleSearch,
  setYearFilter,
  setMovieLanguageFilter,
  setGenreFilter,
  setMinRatingFilter,
  setMaxRatingFilter,
  setSortByFilter,
  clearAllFilters
}: FilterPanelProps) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* Search Input - Always Visible */}
      <SearchBar
        searchQuery={searchQuery}
        isLoading={isLoading}
        language={language}
        handleSearchInputChange={handleSearchInputChange}
        clearSearch={clearSearch}
        handleSearch={handleSearch}
      />

      {/* Advanced Filters - Collapsible */}
      {isFilterOpen && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('year')}
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allYears')}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('genre')}
              </label>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allGenres')}</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('language')}
              </label>
              <select
                value={movieLanguageFilter}
                onChange={(e) => setMovieLanguageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{t('allLanguages')}</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('sortBy')}
              </label>
              <select
                value={sortByFilter}
                onChange={(e) => setSortByFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>
                    {getSortOptionLabel(option, t)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating Range */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('minRating')}: {minRatingFilter}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('maxRating')}: {maxRatingFilter}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={maxRatingFilter}
                onChange={(e) => setMaxRatingFilter(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('clearFilters')}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};