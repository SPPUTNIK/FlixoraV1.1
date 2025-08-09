'use client';

import { useState, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLanguageStore } from '@/store/languageStore';
import { useInfiniteMovies } from '@/hooks/useMovies';
import { useFilteredMovies } from '@/hooks/useFilteredMovies';
import { useDebounce } from '@/hooks/useDebounce';
import { MovieCard } from '@/components/MovieCard';
import { FilterPanel } from '@/components/FilterPanel';
import { MobileFilterModal } from '@/components/MobileFilterModal';
import { useTranslation } from '@/hooks/useTranslation';
import { Movie } from '@/services/types';

export default function LibraryPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [movieLanguageFilter, setMovieLanguageFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [maxRatingFilter, setMaxRatingFilter] = useState(10);
  const [sortByFilter, setSortByFilter] = useState('popularity.desc');

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  // Check if we have active filters
  const hasActiveFilters = useMemo(() => {
    return !!(
      debouncedSearchTerm ||
      yearFilter ||
      movieLanguageFilter ||
      genreFilter ||
      minRatingFilter > 0 ||
      maxRatingFilter < 10 ||
      sortByFilter !== 'popularity.desc'
    );
  }, [debouncedSearchTerm, yearFilter, movieLanguageFilter, genreFilter, minRatingFilter, maxRatingFilter, sortByFilter]);

  // Use filtered movies when filters are active, otherwise use infinite movies
  const {
    data: filteredData,
    fetchNextPage: filteredFetchNextPage,
    hasNextPage: filteredHasNextPage,
    isLoading: isFilteredLoading,
    error: filteredError,
    isFetching: filteredIsFetching
  } = useFilteredMovies({
    title: debouncedSearchTerm,
    year: yearFilter ? parseInt(yearFilter) : undefined,
    language: movieLanguageFilter,
    genre: genreFilter,
    minRating: minRatingFilter > 0 ? minRatingFilter : undefined,
    maxRating: maxRatingFilter < 10 ? maxRatingFilter : undefined,
    sortBy: sortByFilter,
  });

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
    error: infiniteError,
  } = useInfiniteMovies({ enabled: !hasActiveFilters });

  // Process the data based on which source we're using
  const { movies, totalResults, isLoading, error, canLoadMore, loadMoreFn } = useMemo(() => {
    if (hasActiveFilters) {
      // Using filtered data
      const movies = (filteredData?.pages || []).filter((movie): movie is Movie => movie != null && movie.id != null);
      return {
        movies,
        totalResults: filteredData?.totalResults || 0,
        isLoading: isFilteredLoading,
        error: filteredError,
        canLoadMore: filteredHasNextPage || false,
        loadMoreFn: filteredFetchNextPage,
      };
    } else {
      // Using infinite data
      const movies = (infiniteData?.pages?.flat() || []).filter((movie): movie is Movie => movie != null && movie.id != null);
      return {
        movies,
        totalResults: movies.length,
        isLoading: isInfiniteLoading,
        error: infiniteError,
        canLoadMore: hasNextPage || false,
        loadMoreFn: fetchNextPage,
      };
    }
  }, [
    hasActiveFilters,
    filteredData,
    filteredHasNextPage,
    filteredFetchNextPage,
    isFilteredLoading,
    filteredError,
    infiniteData,
    hasNextPage,
    fetchNextPage,
    isInfiniteLoading,
    infiniteError,
  ]);

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (canLoadMore && !filteredIsFetching && !isFetchingNextPage) {
      loadMoreFn();
    }
  }, [canLoadMore, filteredIsFetching, isFetchingNextPage, loadMoreFn]);

  // Search handlers
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSearch = () => {
    // Search is handled automatically via debounced term
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setMovieLanguageFilter('');
    setGenreFilter('');
    setMinRatingFilter(0);
    setMaxRatingFilter(10);
    setSortByFilter('popularity.desc');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with Title, Search, and Filters */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
                {t('library.title')}
              </h1>
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {totalResults > 0 ? totalResults : movies.length} {movies.length === 1 ? t('library.movieFound') : t('library.moviesFound')}
                  {hasActiveFilters && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                      {language === 'fr' ? 'Filtré' : 'Filtered'}
                    </span>
                  )}
                </div>
                
                {/* Desktop Filter Toggle Button */}
                <button 
                  className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V20C14 20.3688 13.7966 20.7077 13.4648 20.8817L9.46482 22.8817C9.04376 23.0915 8.54077 23.0056 8.21799 22.6828C7.89522 22.36 7.80923 21.857 8.01903 21.4359L9.91903 17.2359C10.0809 16.9141 10.4 16.7 10.75 16.7H12V14L5.29289 7.29289C5.10536 7.10536 5 6.851 5 6.58579V4Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isFilterOpen ? (language === 'fr' ? 'Masquer Filtres' : 'Hide Filters') : (language === 'fr' ? 'Afficher Filtres' : 'Show Filters')}
                </button>
                
                {/* Mobile Filter Toggle Button */}
                <button 
                  className="sm:hidden flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V20C14 20.3688 13.7966 20.7077 13.4648 20.8817L9.46482 22.8817C9.04376 23.0915 8.54077 23.0056 8.21799 22.6828C7.89522 22.36 7.80923 21.857 8.01903 21.4359L9.91903 17.2359C10.0809 16.9141 10.4 16.7 10.75 16.7H12V14L5.29289 7.29289C5.10536 7.10536 5 6.851 5 6.58579V4Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isFilterOpen ? (language === 'fr' ? 'Masquer' : 'Hide') : (language === 'fr' ? 'Filtres' : 'Filters')}
                </button>
              </div>
            </div>
            
            {/* Unified Search and Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300">
              <FilterPanel
                isFilterOpen={isFilterOpen}
                language={language}
                searchQuery={searchQuery}
                isLoading={isLoading}
                yearFilter={yearFilter}
                movieLanguageFilter={movieLanguageFilter}
                genreFilter={genreFilter}
                minRatingFilter={minRatingFilter}
                maxRatingFilter={maxRatingFilter}
                sortByFilter={sortByFilter}
                handleSearchInputChange={handleSearchInputChange}
                clearSearch={clearSearch}
                handleSearch={handleSearch}
                setYearFilter={setYearFilter}
                setMovieLanguageFilter={setMovieLanguageFilter}
                setGenreFilter={setGenreFilter}
                setMinRatingFilter={setMinRatingFilter}
                setMaxRatingFilter={setMaxRatingFilter}
                setSortByFilter={setSortByFilter}
                clearAllFilters={clearAllFilters}
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {language === 'fr' ? 'Filtres actifs:' : 'Active filters:'}
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  {language === 'fr' ? 'Tout effacer' : 'Clear all'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Search: {debouncedSearchTerm}
                  </span>
                )}
                {yearFilter && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Year: {yearFilter}
                  </span>
                )}
                {genreFilter && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Genre: {genreFilter}
                  </span>
                )}
                {movieLanguageFilter && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Language: {movieLanguageFilter}
                  </span>
                )}
                {(minRatingFilter > 0 || maxRatingFilter < 10) && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Rating: {minRatingFilter}-{maxRatingFilter}
                  </span>
                )}
                {sortByFilter !== 'popularity.desc' && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                    Sort: {sortByFilter}
                  </span>
                )}
              </div>
            </div>
          )}

          

          {/* Loading State */}
          {isLoading && movies.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'fr' ? 'Erreur de chargement' : 'Error loading movies'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {error?.message || (language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')}
                </p>
              </div>
            </div>
          )}

          {/* Movies Grid - Conditional rendering based on filter state */}
          {!isLoading && movies.length > 0 && (
            hasActiveFilters ? (
              // Filtered results - no infinite scroll
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {movies.map((movie: Movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    language={language} 
                  />
                ))}
              </div>
            ) : (
              // Default movies - with infinite scroll
              <InfiniteScroll
                dataLength={movies.length}
                next={loadMore}
                hasMore={canLoadMore}
                loader={
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }
                endMessage={
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>{language === 'fr' ? 'Tous les films ont été chargés!' : 'All movies loaded!'}</p>
                  </div>
                }
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {movies.map((movie: Movie, index: number) => (
                    <MovieCard
                      key={`${movie.id}-${index}`}
                      movie={movie} 
                      language={language}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )
          )}

          {/* No Results */}
          {!isLoading && movies.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'fr' ? 'Aucun film trouvé' : 'No movies found'}
                </h3>
                <p className="text-sm">
                  {language === 'fr' 
                    ? 'Essayez de modifier vos critères de recherche ou vos filtres.' 
                    : 'Try adjusting your search criteria or filters.'}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {language === 'fr' ? 'Effacer tous les filtres' : 'Clear all filters'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        language={language}
        yearFilter={yearFilter}
        movieLanguageFilter={movieLanguageFilter}
        genreFilter={genreFilter}
        minRatingFilter={minRatingFilter}
        maxRatingFilter={maxRatingFilter}
        sortByFilter={sortByFilter}
        setYearFilter={setYearFilter}
        setMovieLanguageFilter={setMovieLanguageFilter}
        setGenreFilter={setGenreFilter}
        setMinRatingFilter={setMinRatingFilter}
        setMaxRatingFilter={setMaxRatingFilter}
        setSortByFilter={setSortByFilter}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
}