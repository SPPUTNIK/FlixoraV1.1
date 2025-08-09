import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersDto {
    @ApiProperty({
    description: "user id",
    example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({
    description: "username",
    example: "Jon_Doe"
    })
    @IsNotEmpty()
    @IsString()
    username: string;
}
