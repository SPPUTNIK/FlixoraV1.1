import { Injectable, HttpException, HttpStatus, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import { MovieSearchDto } from './dto/search-movies.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TMDBService {
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '';
    if (!this.apiKey) {
      throw new Error('TMDB_API_KEY environment variable is required');
    }
  }

  async fetchAllMovies(language: string, page: number) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=${language}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();

      const filteredMovies = data.results
        .filter((movie) => movie.adult === false)
        .map((movie) => ({
          id: movie.id,
          name: movie.title,
          date: movie.release_date,
          vote: movie.vote_average,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }));
      return filteredMovies;

    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch movies from TMDb', error);
    }
  }

  async fetchMovie(movieId: string, language: string): Promise<any> {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}&language=${language}&append_to_response=videos`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB fetch failed with status ${response.status}`);
      }

      const data = await response.json();

      //check for the movie is adult
      if (data.adult === true) {
        throw new Error("Adult content is not allowed.")
      }

      // Extract trailer from videos
      const trailer = data.videos?.results?.find(
        (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
      );

      // Map data to your Movie schema format
      const movieData = {
        id: data.id.toString(),
        imdb_id: data.imdb_id,
        name: data.title,
        year: data.release_date?.split('-')[0] || '',
        overview: data.overview,
        length: data.runtime,
        genres: data.genres?.map((g) => g.name).join(', ') || '',
        image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        rating: data.vote_average,
        trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      };

      return movieData;
    } catch (error) {
      if (error.message == "Adult content is not allowed.") {
        throw new BadRequestException('Adult content is not allowed.');
      }
      console.error('TMDB fetch error:', error.message);
      throw new HttpException('Failed to fetch and map movie data', HttpStatus.BAD_GATEWAY);
    }
  }

  async searchMovies(query: string) {

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new InternalServerErrorException('Failed to fetch movie from TMDb');
    }
    const data = await response.json();
    if (data) {
      const movies: MovieSearchDto[] =  data.results
        .filter((movie) => movie.adult === false)
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          date: movie.release_date,
          vote: movie.vote_average,
          image:  `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))
      return movies;
    }
    return [];
  }

  async filterMovies(filters: any, language: string = 'en') {
    console.log('TMDB filterMovies called with filters:', filters, 'language:', language);
    
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        language: language,
        page: filters.page?.toString() || '1',
        sort_by: filters.sortBy || 'popularity.desc',
        include_adult: 'false',
      });

      // Add filters to URL params
      if (filters.year) {
        params.append('year', filters.year.toString());
      }

      if (filters.genre) {
        console.log('Processing genre filter:', filters.genre);
        // Get genre IDs from genre names
        const genreIds = await this.getGenreIds(filters.genre, language);
        console.log('Genre IDs found:', genreIds);
        if (genreIds.length > 0) {
          params.append('with_genres', genreIds.join(','));
        }
      }

      if (filters.minRating !== undefined) {
        params.append('vote_average.gte', filters.minRating.toString());
      }

      if (filters.maxRating !== undefined) {
        params.append('vote_average.lte', filters.maxRating.toString());
      }

      if (filters.language && filters.language !== language) {
        params.append('with_original_language', filters.language);
      }

      let url: string;
      
      // If title search is provided, use search endpoint instead of discover
      if (filters.title) {
        url = `https://api.themoviedb.org/3/search/movie?${params.toString()}&query=${encodeURIComponent(filters.title)}`;
        console.log('Using search URL:', url);
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
        console.log('Using discover URL:', url);
      }

      console.log('Making TMDB API request to:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('TMDB API response not ok:', response.status, response.statusText);
        throw new Error(`Failed to fetch filtered movies: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('TMDB API response received, total results:', data.total_results);

      const filteredMovies = data.results
        .filter((movie) => movie.adult === false)
        .map((movie) => ({
          id: movie.id,
          name: movie.title,
          date: movie.release_date,
          vote: movie.vote_average,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genres: movie.genre_ids || [],
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        }));

      const result = {
        results: filteredMovies,
        totalPages: data.total_pages,
        totalResults: data.total_results,
        currentPage: data.page,
      };

      console.log('Returning filtered results:', result.results.length, 'movies');
      return result;

    } catch (error) {
      console.error('Error in filterMovies:', error);
      if (error.message?.includes('Failed to fetch filtered movies')) {
        throw error; // Re-throw TMDB API errors
      }
      throw new InternalServerErrorException('Failed to fetch filtered movies from TMDb: ' + error.message);
    }
  }

  private async getGenreIds(genreNames: string, language: string = 'en'): Promise<number[]> {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=${language}`;
    
    try {
      console.log('Fetching genres from TMDB for language:', language);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.statusText}`);
      }
      const data = await response.json();
      
      const requestedGenres = genreNames.split(',').map(g => g.trim().toLowerCase());
      const genreIds: number[] = [];
      
      console.log('Available genres:', data.genres.map(g => g.name));
      console.log('Requested genres:', requestedGenres);
      
      for (const genre of data.genres) {
        if (requestedGenres.includes(genre.name.toLowerCase())) {
          genreIds.push(genre.id);
        }
      }
      
      console.log('Matched genre IDs:', genreIds);
      return genreIds;
    } catch (error) {
      console.error('Error fetching genre IDs:', error);
      return [];
    }
  }
}
