import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '@/services/movie-service';
import { Movie } from '@/services/types';

/**
 * Custom hook for searching movies
 * @param query Search query string
 * @returns Query result with search results
 */
export const useSearchMovies = (query: string) => {
  return useQuery<Movie[]>({
    queryKey: ['search-movies', query],
    queryFn: () => searchMovies(query),
    enabled: query.length > 2, // Only run the query if query is at least 3 characters
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};