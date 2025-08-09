import { useInfiniteQuery } from '@tanstack/react-query';
import { getFilteredMovies } from '@/services/movie-service';
import { MovieFilterParams, Movie } from '@/services/types';

export const useFilteredMovies = (filters: MovieFilterParams) => {
  // Only enable the query if we have meaningful filters
  const hasFilters = !!(
    filters.title ||
    filters.year ||
    filters.genre ||
    filters.minRating ||
    filters.maxRating ||
    filters.language ||
    (filters.sortBy && filters.sortBy !== 'popularity.desc')
  );

  return useInfiniteQuery({
    queryKey: ['filtered-movies', filters],
    queryFn: ({ pageParam = 1 }) => {
      return getFilteredMovies({ ...filters, page: pageParam as number });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.map(page => page.results).flat(),
      pageParams: data.pageParams,
      totalResults: data.pages[0]?.totalResults || 0,
      totalPages: data.pages[0]?.totalPages || 0,
    }),
    enabled: hasFilters, // Only run when we have filters
  });
};