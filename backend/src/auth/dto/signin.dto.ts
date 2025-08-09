import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  
  @ApiProperty({
    description: "user name",
    example: "Jon_Doe"
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: "user password",
    example: "Jon.Doe_123"
  })
  @IsString()
  @MinLength(8)
  password: string;
}
