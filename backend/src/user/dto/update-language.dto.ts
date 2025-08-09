// dto/update-language.dto.ts
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLanguageDto {
  @ApiProperty({
    description: 'The language code to set for the user',
    example: 'en',
    enum: ['en', 'fr', 'es'],
  })
  @IsIn(['en', 'ar', 'fr', 'es'], { message: 'Language must be one of: en, fr, es' })
  language: string;
}