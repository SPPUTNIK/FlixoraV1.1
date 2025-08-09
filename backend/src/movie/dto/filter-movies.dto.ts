import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterMoviesDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Search by movie title',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by release year',
    example: 2010,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by genre (comma-separated for multiple)',
    example: 'Action,Drama',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Minimum rating (0-10)',
    example: 6.0,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Maximum rating (0-10)',
    example: 9.0,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  maxRating?: number;

  @ApiPropertyOptional({
    description: 'Filter by language code (ISO 639-1)',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Sort order for results',
    example: 'popularity.desc',
    enum: [
      'popularity.desc',
      'popularity.asc',
      'release_date.desc',
      'release_date.asc',
      'vote_average.desc',
      'vote_average.asc',
      'title.asc',
      'title.desc'
    ],
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'popularity.desc',
    'popularity.asc',
    'release_date.desc',
    'release_date.asc',
    'vote_average.desc',
    'vote_average.asc',
    'title.asc',
    'title.desc'
  ])
  sortBy?: string = 'popularity.desc';
}