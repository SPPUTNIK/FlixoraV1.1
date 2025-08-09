import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: "Reset token from email",
    example: "abc123def456"
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: "New password",
    example: "NewPassword123"
  })
  @IsString()
  @MinLength(8)
  password: string;
}