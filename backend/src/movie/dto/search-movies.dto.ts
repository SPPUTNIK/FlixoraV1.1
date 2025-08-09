import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MovieSearchDto {
  @ApiPropertyOptional({
    description: 'The unique identifier of the movie',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'Title of the movie',
    example: 'Inception',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Average vote or rating of the movie',
    example: 8.7,
  })
  @IsOptional()
  @IsNumber()
  vote?: number;

  @ApiPropertyOptional({
    description: 'Release date of the movie in YYYY-MM-DD format',
    example: '2010-07-16',
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({
    description: 'URL or path to the movie image',
    example: 'https://example.com/images/inception.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
