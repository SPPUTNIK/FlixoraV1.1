export interface Movie {
  genre: boolean;
  id: number;
  name: string;         // The API uses "name" instead of "title"
  date?: string;        // Format: "YYYY-MM-DD"
  vote: number;         // Rating value
  image: string;        // Image URL
  imdb_id?: string;     // Optional IMDb ID
    year?: string;        // Year of release
    overview?: string;     // Movie overview
    length?: number;       // Length of the movie in minutes
    genres?: string;        // Comma-separated list of genres
    rating?: number;       // Rating value
    director?: string;
    runTime?: number;
    language?: string;
    quality?: string;
    synopsis?: string;
    trailerUrl?: string;
    watched?: boolean;
    imdbId?: string;
    subtitles?: string[];
    popularity?: number;
    trailer?: string;
}

export interface MovieDetails {
  movieData: Movie;
}

export interface MovieSearchParams {
  language?: string;
  year?: string;
  title?: string;
}

export interface MovieFilterParams {
  page?: number;
  title?: string;
  year?: number;
  genre?: string;
  minRating?: number;
  maxRating?: number;
  language?: string;
  sortBy?: string;
}

export interface FilteredMoviesResponse {
  results: Movie[];
  totalPages: number;
  totalResults: number;
  currentPage: number;
}

export interface MoviesResponse {
  name: string;
  date: any;
  vote: number;
  popularity: any;
  id:  null | undefined;
  image: string | undefined;
  watched: any;
  quality: any;
  genre: boolean;
  director: any;
  runTime: any;
  language: any;
  page: number;
  hasNext: boolean;
  movies: Movie[];
}