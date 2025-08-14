import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MovieSearchDto } from './dto/search-movies.dto';

@Injectable()
export class OMDBService {
  private readonly BASE_URL = 'http://www.omdbapi.com/';
  private readonly OMDB_KEY: string;

  constructor(private configService: ConfigService) {
    this.OMDB_KEY = this.configService.get<string>('OMDB_API_KEY') || '';
    if (!this.OMDB_KEY) {
      console.warn('OMDB_API_KEY environment variable is not set. OMDB service will be disabled.');
    }
  }

  async searchMovies(query: string): Promise<MovieSearchDto[]> {
    const OMDB_URL = `${this.BASE_URL}?apikey=${this.OMDB_KEY}&s=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(OMDB_URL);
      const data = await response.json();

      if (data.Response === 'False') {
        return [];
      }

      const movies: MovieSearchDto[] = data.Search.map((movie) => ({
        id: movie.imdbID, // OMDb returns imdbID, not a numeric id
        title: movie.Title,
        date: movie.Year,
        vote: null, // OMDb search results do not include rating
        image: movie.Poster,
      }));

      return movies;
    } catch (error) {
      console.error('OMDb search error:', error);
      throw new InternalServerErrorException('Failed to fetch movies from OMDb');
    }
  }
}