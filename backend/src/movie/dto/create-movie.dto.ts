import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDate } from 'class-validator';

export class CreateMovieDto {
  
  @IsString()
  id: string;

  @IsString()
  imdb_id: string;

  @IsString()
  name: string;

  @IsString()
  year: string;

  @IsNumber()
  length: number;
}
