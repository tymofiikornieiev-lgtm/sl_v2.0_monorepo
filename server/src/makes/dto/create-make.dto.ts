import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class CreateMakeDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value?.trim() : value,
  )
  @IsNotEmpty({ message: 'Property "name" cannot be empty' })
  @IsString({ message: 'Property "name" must be a string' })
  @MaxLength(50, {
    message: 'Property "name" must be at most 50 characters',
  })
  name!: string;
}
