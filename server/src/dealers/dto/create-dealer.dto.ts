import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreateDealerDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Property "name" must be a string' })
  @IsNotEmpty({ message: 'Property "name" cannot be empty' })
  @MinLength(2, {
    message: 'Property "name" must be at least 2 characters',
  })
  @MaxLength(100, {
    message: 'Property "name" must be at most 100 characters',
  })
  name!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString({ message: 'Property "phone" must be a string' })
  @MaxLength(100, {
    message: 'Property "phone" must be at most 100 characters',
  })
  phone?: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString({ message: 'Property "address" must be a string' })
  @MaxLength(200, {
    message: 'Property "address" must be at most 200 characters',
  })
  address?: string;
}
