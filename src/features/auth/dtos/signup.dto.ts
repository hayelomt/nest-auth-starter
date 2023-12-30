import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { isUnique } from 'src/core';

export class SignupDto {
  @IsString()
  @MaxLength(255)
  @IsEmail()
  @isUnique(
    { table: 'user', column: 'email' },
    { message: 'email already in use' },
  )
  email: string;

  @IsString()
  @MaxLength(50)
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
