import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getMovies, getMovieById, searchMovies } from '@/services/movie-service';
import { Movie, MovieDetails, MovieSearchParams } from '@/services/types';

export const useMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', page],
    queryFn: () => getMovies(page),
  });
};

export const useInfiniteMovies = (params: MovieSearchParams) => {
  return useInfiniteQuery<Movie[]>({
    queryKey: ['infinite-movies', params],
    queryFn: ({ pageParam = 1 }) => {
      // Pass the search parameters to your API
      return getMovies(pageParam as number, params);
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we received movies (assuming 20 per page is full page),
      // we can fetch the next page
      if (lastPage.length === 20) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useMovie = (id: string) => {
  return useQuery<MovieDetails>({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string) => {
  return useQuery({
    queryKey: ['search-movies', query],
    queryFn: () => searchMovies(query),
    enabled: query.length > 2, // Only run the query if query is at least 3 characters
  });
};

