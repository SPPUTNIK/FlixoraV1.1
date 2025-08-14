import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getMovies, getMovieById, searchMovies } from '@/services/movie-service';
import { Movie, MovieDetails, MovieSearchParams, MovieFilterParams } from '@/services/types';

export const useMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', page],
    queryFn: () => getMovies(page),
  });
};

// Convert search params to filter params
const convertSearchToFilterParams = (searchParams: MovieSearchParams): MovieFilterParams => {
  return {
    title: searchParams.title,
    year: searchParams.year ? parseInt(searchParams.year, 10) : undefined,
    language: searchParams.language,
  };
};

export const useInfiniteMovies = (params: MovieSearchParams) => {
  return useInfiniteQuery<Movie[]>({
    queryKey: ['infinite-movies', params],
    queryFn: ({ pageParam = 1 }) => {
      // Convert search params to filter params
      const filterParams = convertSearchToFilterParams(params);
      return getMovies(pageParam as number, filterParams);
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

