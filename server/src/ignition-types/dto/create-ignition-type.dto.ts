import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class CreateIgnitionTypeDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({
    message: 'Property "name" must be a string',
  })
  @IsNotEmpty({
    message: 'Property "name" cannot be empty',
  })
  @MinLength(2, {
    message: 'Property "name" must be at least 2 characters',
  })
  @MaxLength(100, {
    message: 'Property "name" must be at most 100 characters',
  })
  name!: string;
}
