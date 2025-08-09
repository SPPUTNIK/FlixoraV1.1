import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MovieSearchDto } from './dto/search-movies.dto';

@Injectable()
export class YTSService {
  private readonly BASE_URL = 'https://yts.mx/api/v2/list_movies.json';

  async searchMovies(query: string): Promise<MovieSearchDto[]> {
    const url = `${this.BASE_URL}?query_term=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.data.movies) {
        const movies: MovieSearchDto[] = data.data.movies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          date: movie.year,
          vote: movie.rating,
          image: movie.background_image,
        }));
        return movies;
      } else {
        return [];
      }
    } catch (error) {
      console.error('YTS search error:', error);
      throw new InternalServerErrorException('Failed to fetch movies from YTS');
    }
  }
}