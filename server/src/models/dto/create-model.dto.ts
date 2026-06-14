import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export default class CreateModelDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value?.trim() : value,
  )
  @IsNotEmpty({ message: 'Property "name" cannot be empty' })
  @IsString({ message: 'Property "name" must be a string' })
  @MaxLength(50, {
    message: 'Property "name" must be at most 50 characters',
  })
  name!: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Property "makeId" cannot be empty' })
  @IsInt({ message: 'Property "makeId" must be an integer' })
  @Min(1, {
    message: 'Property "makeId" must be at least 1',
  })
  makeId!: number;
}
