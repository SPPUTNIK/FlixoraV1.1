import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrentUserDto {
  @ApiProperty({
    description: "First Name",
    example: "John",
    required: false
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({
    description: "Last Name", 
    example: "Doe",
    required: false
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    description: "Username",
    example: "johndoe123",
    required: false
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: "Email address",
    example: "john.doe@example.com",
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "Avatar image path",
    example: "uploads/avatar123.jpg",
    required: false
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: "Background image path",
    example: "uploads/background123.jpg", 
    required: false
  })
  @IsOptional()
  @IsString()
  background?: string;
}