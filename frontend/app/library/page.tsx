'use client';

import { useState, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLanguageStore } from '@/store/languageStore';
import { useInfiniteMovies } from '@/hooks/useMovies';
import { useFilteredMovies } from '@/hooks/useFilteredMovies';
import { useDebounce } from '@/hooks/useDebounce';
import MovieCard from '@/components/MovieCard';
import { FilterPanel } from '@/components/FilterPanel';
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
  } = useInfiniteMovies({});

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-6000"></div>
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with Title, Search, and Filters */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  {t('library.title')}
                </h1>
                <p className="text-gray-300 text-base sm:text-lg">
                  {t('common.discoverMovies')}
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-sm text-gray-200">
                  <span className="font-medium">{totalResults > 0 ? totalResults : movies.length}</span> {movies.length === 1 ? t('library.movieFound') : t('library.moviesFound')}
                  {hasActiveFilters && (
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium shadow-lg">
                      {t('common.filtered')}
                    </span>
                  )}
                </div>
                
                {/* Desktop Filter Toggle Button */}
                <button 
                  className="hidden sm:flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-gray-200 hover:text-white px-4 py-2.5 rounded-xl border border-white/20 hover:border-white/30 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-purple-500/20"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V20C14 20.3688 13.7966 20.7077 13.4648 20.8817L9.46482 22.8817C9.04376 23.0915 8.54077 23.0056 8.21799 22.6828C7.89522 22.36 7.80923 21.857 8.01903 21.4359L9.91903 17.2359C10.0809 16.9141 10.4 16.7 10.75 16.7H12V14L5.29289 7.29289C5.10536 7.10536 5 6.851 5 6.58579V4Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isFilterOpen ? t('common.hideFilters') : t('common.showFilters')}
                </button>
                
                {/* Mobile Filter Toggle Button */}
                <button 
                  className="sm:hidden flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14 14V20C14 20.3688 13.7966 20.7077 13.4648 20.8817L9.46482 22.8817C9.04376 23.0915 8.54077 23.0056 8.21799 22.6828C7.89522 22.36 7.80923 21.857 8.01903 21.4359L9.91903 17.2359C10.0809 16.9141 10.4 16.7 10.75 16.7H12V14L5.29289 7.29289C5.10536 7.10536 5 6.851 5 6.58579V4Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {isFilterOpen ? t('common.hide') : t('common.filters')}
                </button>
              </div>
            </div>
            
            {/* Unified Search and Filter Bar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-purple-500/10 hover:border-white/30">
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
            <div className="mb-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-800/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5S20.5523 6 20 6H19V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6H4C3.44772 6 3 5.55228 3 5S3.44772 4 4 4H7ZM9 3V4H15V3H9ZM7 6V20H17V6H7ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z"/>
                  </svg>
                  {t('common.activeFilters')}
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                >
                  {t('common.clearAllFilters')}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    Search: {debouncedSearchTerm}
                  </span>
                )}
                {yearFilter && (
                  <span className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Year: {yearFilter}
                  </span>
                )}
                {genreFilter && (
                  <span className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 110 2h-1v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6H4a1 1 0 110-2h3z"/>
                    </svg>
                    Genre: {genreFilter}
                  </span>
                )}
                {movieLanguageFilter && (
                  <span className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                    </svg>
                    Language: {movieLanguageFilter}
                  </span>
                )}
                {(minRatingFilter > 0 || maxRatingFilter < 10) && (
                  <span className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-medium shadow-md">
                    <svg className="w-4 h-4 mr-2 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Rating: {minRatingFilter}-{maxRatingFilter}
                  </span>
                )}
                {sortByFilter !== 'popularity.desc' && (
                  <span className="inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002-2h14a2 2 0 002 2v0a2 2 0 00-2 2H5a2 2 0 00-2 2z"/>
                    </svg>
                    Sort: {sortByFilter}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && movies.length === 0 && (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300/30 border-t-purple-500 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-pink-300/30 border-t-pink-500 mx-auto animate-spin" style={{animationDelay: '0.5s', animationDirection: 'reverse'}}></div>
                </div>
                <p className="mt-4 text-gray-300 font-medium">Loading amazing movies...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-red-500/30">
                <div className="text-red-400 mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {language === 'fr' ? 'Erreur de chargement' : 'Error loading movies'}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {error?.message || (language === 'fr' ? 'Une erreur est survenue' : 'An error occurred')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Movies Grid - Conditional rendering based on filter state */}
          {!isLoading && movies.length > 0 && (
            hasActiveFilters ? (
              // Filtered results - no infinite scroll
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
                {movies.map((movie: Movie) => (
                  <div key={movie.id} className="transform hover:scale-105 transition-all duration-300">
                    <MovieCard 
                      movie={movie} 
                    />
                  </div>
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
                    <div className="relative inline-block">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                      <div className="absolute inset-0 rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 animate-spin" style={{animationDelay: '0.3s', animationDirection: 'reverse'}}></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading more movies...</p>
                  </div>
                }
                endMessage={
                  <div className="text-center py-12">
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 max-w-sm mx-auto border border-gray-200/50 dark:border-gray-700/50">
                      <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{language === 'fr' ? 'Tous les films ont été chargés!' : 'All movies loaded!'}</p>
                    </div>
                  </div>
                }
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
                  {movies.map((movie: Movie, index: number) => (
                    <div key={`${movie.id}-${index}`} className="transform hover:scale-105 transition-all duration-300">
                      <MovieCard
                        movie={movie} 
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )
          )}

          {/* No Results */}
          {!isLoading && movies.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-gray-500 dark:text-gray-400 mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700/30 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {language === 'fr' ? 'Aucun film trouvé' : 'No movies found'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {language === 'fr' 
                      ? 'Essayez de modifier vos critères de recherche ou vos filtres.' 
                      : 'Try adjusting your search criteria or filters.'}
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    {language === 'fr' ? 'Effacer tous les filtres' : 'Clear all filters'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}