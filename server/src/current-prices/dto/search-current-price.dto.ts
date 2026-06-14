import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchCurrentPriceDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'Property "year" must be an integer' })
  @Min(1900, { message: 'Property "year" must be at least 1900' })
  year?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'Property "dealerId" must be an integer' })
  @Min(1, { message: 'Property "dealerId" must be at least 1' })
  dealerId?: number;

  @IsOptional()
  @IsString({ message: 'Property "make" must be a string' })
  make?: string;

  @IsOptional()
  @IsString({ message: 'Property "model" must be a string' })
  model?: string;

  @IsOptional()
  @IsString({ message: 'Property "typeOfKey" must be a string' })
  typeOfKey?: string;

  @IsOptional()
  @IsString({ message: 'Property "typeOfIgnition" must be a string' })
  typeOfIgnition?: string;
}
