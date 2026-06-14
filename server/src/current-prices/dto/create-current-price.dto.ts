import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  Matches,
  Min,
  MinLength,
  MaxLength,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

const priceRegex = /^\d+(\.\d{1,2})?$/;

export class CreateCurrentPriceDto {
  @Type(() => Number)
  @IsNotEmpty({
    message: 'Property "vehicleConfigurationId" cannot be empty',
  })
  @IsInt({
    message: 'Property "vehicleConfigurationId" must be an integer',
  })
  @Min(1, {
    message: 'Property "vehicleConfigurationId" must be at least 1',
  })
  vehicleConfigurationId!: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: 'Property "dealerId" must be an integer',
  })
  @Min(1, {
    message: 'Property "dealerId" must be at least 1',
  })
  dealerId?: number;

  @IsOptional()
  @IsString({
    message: 'Property "priceSecureLocksAKL" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceSecureLocksAKL" must be a valid price with up to 2 decimal places',
  })
  priceSecureLocksAKL?: string;

  @IsOptional()
  @IsString({
    message: 'Property "priceSecureLocksAddKey" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceSecureLocksAddKey" must be a valid price with up to 2 decimal places',
  })
  priceSecureLocksAddKey?: string;

  @IsOptional()
  @IsString({
    message: 'Property "priceSecureLocksProgramOnly" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceSecureLocksProgramOnly" must be a valid price with up to 2 decimal places',
  })
  priceSecureLocksProgramOnly?: string;

  @IsOptional()
  @IsString({
    message: 'Property "priceSecureLocksParts" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceSecureLocksParts" must be a valid price with up to 2 decimal places',
  })
  priceSecureLocksParts?: string;

  @IsOptional()
  @IsString({
    message: 'Property "priceDealerTransmitter" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceDealerTransmitter" must be a valid price with up to 2 decimal places',
  })
  priceDealerTransmitter?: string;

  @IsOptional()
  @IsString({
    message: 'Property "priceDealerProgram" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceDealerProgram" must be a valid price with up to 2 decimal places',
  })
  priceDealerProgram?: string;

  @IsOptional()
  @IsString({
    message: 'Property "priceDealerBlade" must be a string',
  })
  @Matches(priceRegex, {
    message:
      'Property "priceDealerBlade" must be a valid price with up to 2 decimal places',
  })
  priceDealerBlade?: string;

  @IsOptional()
  @IsString({
    message: 'Property "vin" must be a string',
  })
  @MinLength(5, {
    message: 'Property "vin" must be at least 5 characters',
  })
  @MaxLength(30, {
    message: 'Property "vin" must be at most 30 characters',
  })
  vin?: string;

  @IsOptional()
  @IsString({
    message: 'Property "partNumber" must be a string',
  })
  @MaxLength(100, {
    message: 'Property "partNumber" must be at most 100 characters',
  })
  partNumber?: string;

  @IsOptional()
  @IsString({
    message: 'Property "link" must be a string',
  })
  @MaxLength(200, {
    message: 'Property "link" must be at most 200 characters',
  })
  @IsUrl({}, { message: 'Property "link" must contain a URL' })
  link?: string;

  @IsOptional()
  @IsString({
    message: 'Property "comments" must be a string',
  })
  @MaxLength(1000, {
    message: 'Property "comments" must be at most 1000 characters',
  })
  comments?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Property "dateCalled" must be a valid ISO date string',
    },
  )
  dateCalled?: string;

  @Type(() => Number)
  @IsNotEmpty({
    message: 'Property "createdByUserId" cannot be empty',
  })
  @IsInt({
    message: 'Property "createdByUserId" must be an integer',
  })
  @Min(1, {
    message: 'Property "createdByUserId" must be at least 1',
  })
  createdByUserId!: number;

  @Type(() => Number)
  @IsNotEmpty({
    message: 'Property "updatedByUserId" cannot be empty',
  })
  @IsInt({
    message: 'Property "updatedByUserId" must be an integer',
  })
  @Min(1, {
    message: 'Property "updatedByUserId" must be at least 1',
  })
  updatedByUserId!: number;
}
