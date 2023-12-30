import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MaxLength(255)
  @IsEmail()
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
