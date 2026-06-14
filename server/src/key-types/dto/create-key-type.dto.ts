import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class CreateKeyTypeDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'Property "name" must be a string' })
  @IsNotEmpty({ message: 'Property "name" cannot be empty' })
  @MaxLength(50, {
    message: 'Property "name" must be at most 50 characters',
  })
  name!: string;
}
