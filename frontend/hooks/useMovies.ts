import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getMovies, getMovieById, searchMovies } from '@/services/movie-service';
import { Movie, MovieDetails, MovieSearchParams, MovieFilterParams } from '@/services/types';
import { useLanguageStore } from '@/store/languageStore';

export const useMovies = (page = 1) => {
  const { language } = useLanguageStore();
  
  return useQuery({
    queryKey: ['movies', page, language],
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
  const { language } = useLanguageStore();
  
  return useInfiniteQuery<Movie[]>({
    queryKey: ['infinite-movies', params, language],
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
  const { language } = useLanguageStore();
  
  return useQuery<MovieDetails>({
    queryKey: ['movie', id, language],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string) => {
  const { language } = useLanguageStore();
  
  return useQuery({
    queryKey: ['search-movies', query, language],
    queryFn: () => searchMovies(query),
    enabled: query.length > 2, // Only run the query if query is at least 3 characters
  });
};

