import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: "First Name",
    example: "Jon"
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    description: "Last Name",
    example: "Doe"
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    description: "User Name",
    example: "Jon_doe"
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: "User Email",
    example: "jon.doe@example.com"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password",
    example: "Jon.Doe_123"
  })
  @IsString()
  @MinLength(8)
  password: string;
}
