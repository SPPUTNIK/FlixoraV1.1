import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  username: string;

  @IsOptional()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  avatar: string | null;

  @IsOptional()
  @IsString()
  background: string | null;
}
