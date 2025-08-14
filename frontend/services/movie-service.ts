import { apiClient } from './api-client';
import { Movie, MovieDetails, MovieFilterParams, FilteredMoviesResponse } from './types';
import { config } from '../config/api';

export const getMovies = async (page = 1, params?: MovieFilterParams) => {
  // Build the query string with all parameters
  let queryParams = `page=${page}`;
  
  if (params) {
    if (params.language) queryParams += `&language=${params.language}`;
    if (params.year) queryParams += `&year=${params.year}`;
    if (params.genre) queryParams += `&genre=${params.genre}`;
    if (params.minRating) queryParams += `&minRating=${params.minRating}`;
    if (params.maxRating) queryParams += `&maxRating=${params.maxRating}`;
    if (params.sortBy) queryParams += `&sortBy=${params.sortBy}`;
  }

  const response = await apiClient.get<any[]>(`/movies?${queryParams}`);
  return response.data.map(normalizeMovie);
};

export const getMovieById = async (id: string): Promise<MovieDetails> => {
  const response = await apiClient.get<MovieDetails>(`/movies/${id}`);
  return response.data;
};

export const getFilteredMovies = async (params: MovieFilterParams): Promise<FilteredMoviesResponse> => {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.title) queryParams.append('title', params.title);
  if (params.year) queryParams.append('year', params.year.toString());
  if (params.language) queryParams.append('language', params.language);
  if (params.genre) queryParams.append('genre', params.genre);
  if (params.minRating !== undefined) queryParams.append('minRating', params.minRating.toString());
  if (params.maxRating !== undefined) queryParams.append('maxRating', params.maxRating.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);

  const response = await apiClient.get<FilteredMoviesResponse>(`/movies/filter?${queryParams.toString()}`);
  return response.data;
};

// Keep the old name for backward compatibility
export const filterMovies = getFilteredMovies;

export const searchMovies = async (query: string) => {
  const response = await apiClient.get<any[]>(`/movies/search?title=${encodeURIComponent(query)}`);
  return response.data.map(normalizeMovie);
};

// Update getStreamUrl to use the API base URL
export function getStreamUrl(imdbID: string, title: string, quality?: string) {
  const baseUrl = config.apiUrl || 'http://flixora.uk:3001';
  const params = new URLSearchParams({
    imdbID,
    title,
    ...(quality && { quality })
  });
  return `${baseUrl}/movies/stream?${params.toString()}`;
}

// For subtitles, we'll fetch them as text and create blob URLs
export async function getSubtitleContent(imdbID: string, title: string): Promise<string | null> {
  try {
    const baseUrl = config.apiUrl;
    const params = new URLSearchParams({
      imdbID,
      title
    });
    
    const response = await fetch(`${baseUrl}/movies/stream/subtitle?${params.toString()}`, {
      method: 'GET',
      // Remove credentials since we don't need authentication anymore
    });
    
    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch subtitles:', error);
    return null;
  }
}

// Helper function to create blob URL for subtitles
export function createSubtitleBlobUrl(subtitleContent: string): string {
  const blob = new Blob([subtitleContent], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}

export const prepareMovieStream = async (imdbID: string, title: string, quality: string) => {
  const response = await apiClient.post<{ ready: boolean }>('/movies/stream/prepare', {
    imdbID,
    title,
    quality
  });
  return response.data;
};

// Add the missing checkStreamReady function
export const checkStreamReady = async (imdbID: string, title: string, quality: string): Promise<boolean> => {
  try {
    // First try to prepare the stream
    const response = await prepareMovieStream(imdbID, title, quality);
    return response.ready;
  } catch (error) {
    console.error('Failed to check stream readiness:', error);
    // If preparation fails, we'll try to stream anyway and let the video player handle it
    return true;
  }
};

// Helper function to normalize movie data
function normalizeMovie(movie: any): Movie {
  return {
    id: movie.id,
    name: movie.title || movie.name,
    date: movie.release_date || movie.date,
    vote: movie.vote_average || movie.vote,
    image: movie.poster_path ? 
      (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`) 
      : movie.image,
    genre: movie.genre || false,
    overview: movie.overview || '',
    year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 
          movie.date ? new Date(movie.date).getFullYear().toString() : 
          movie.year || '',
    genres: movie.genres || '',
    popularity: movie.popularity || 0,
    watched: movie.watched || false,
    imdb_id: movie.imdb_id || movie.imdbId,
    rating: movie.vote_average || movie.vote || movie.rating,
    length: movie.runtime || movie.length,
    director: movie.director || '',
    runTime: movie.runtime || movie.runTime,
    language: movie.original_language || movie.language || 'en',
    quality: movie.quality || '',
    synopsis: movie.overview || movie.synopsis || '',
    trailerUrl: movie.trailerUrl || '',
    imdbId: movie.imdb_id || movie.imdbId,
    subtitles: movie.subtitles || [],
    trailer: movie.trailer || ''
  };
}

