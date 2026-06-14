import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString({ message: 'The password must be a string' })
  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  @IsNotEmpty()
  password!: string;
}
