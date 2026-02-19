import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @ApiProperty({ example: 'example@test.com' })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'example123' })
  password: string;
}
