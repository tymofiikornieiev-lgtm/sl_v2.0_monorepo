import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreateUserDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Property "email" must be valid' })
  @IsNotEmpty({ message: 'Property "email" cannot be empty' })
  @MaxLength(50, {
    message: 'Property "email" must be at most 50 characters long',
  })
  email!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Property "firstName" should be a string' })
  @IsNotEmpty({ message: 'Property "firstName" cannot be empty' })
  @MinLength(3, {
    message: 'Property "firstName" must be at least 3 characters long',
  })
  @MaxLength(50, {
    message: 'Property "firstName" must be at most 50 characters long',
  })
  firstName!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Property "lastName" should be a string' })
  @IsOptional()
  @MaxLength(50, {
    message: 'Property "lastName" must be at most 50 characters long',
  })
  lastName?: string;

  @IsString({ message: 'Property "password" should be a string' })
  @IsNotEmpty({ message: 'Property "password" cannot be empty' })
  @MinLength(6, {
    message: 'Property "password" must be at least 6 characters long',
  })
  password!: string;

  @IsString({ message: 'Property "passwordConfirmation" should be a string' })
  @IsNotEmpty({ message: 'Property "passwordConfirmation" cannot be empty' })
  @MinLength(6, {
    message:
      'Property "passwordConfirmation" must be at least 6 characters long',
  })
  passwordConfirmation!: string;
}
