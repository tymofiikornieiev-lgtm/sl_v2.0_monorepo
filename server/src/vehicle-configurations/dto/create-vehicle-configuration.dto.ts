import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export default class CreateVehicleConfigurationDto {
  @Type(() => Number)
  @IsInt({
    message: 'Property "year" must be an integer',
  })
  @Min(1900, {
    message: 'Property "year" must be at least 1900',
  })
  @Max(2100, {
    message: 'Property "year" must be at most 2100',
  })
  @IsNotEmpty({ message: 'Property "year" cannot be empty' })
  year!: number;

  @Type(() => Number)
  @IsInt({
    message: 'Property "makeId" must be an integer',
  })
  @Min(1, {
    message: 'Property "makeId" must be at least 1',
  })
  @IsNotEmpty({ message: 'Property "makeId" cannot be empty' })
  makeId!: number;

  @Type(() => Number)
  @IsInt({
    message: 'Property "modelId" must be an integer',
  })
  @Min(1, {
    message: 'Property "modelId" must be at least 1',
  })
  @IsNotEmpty({ message: 'Property "modelId" cannot be empty' })
  modelId!: number;

  @Type(() => Number)
  @IsInt({
    message: 'Property "ignitionTypeId" must be an integer',
  })
  @Min(1, {
    message: 'Property "ignitionTypeId" must be at least 1',
  })
  @IsNotEmpty({ message: 'Property "ignitionTypeId" cannot be empty' })
  ignitionTypeId!: number;

  @Type(() => Number)
  @IsInt({
    message: 'Property "keyTypeId" must be an integer',
  })
  @Min(1, {
    message: 'Property "keyTypeId" must be at least 1',
  })
  @IsNotEmpty({ message: 'Property "keyTypeId" cannot be empty' })
  keyTypeId!: number;

  @Type(() => Number)
  @IsInt({
    message: 'Property "buttonsCount" must be an integer',
  })
  @Min(0, {
    message: 'Property "buttonsCount" must be at least 0',
  })
  @Max(12, {
    message: 'Property "buttonsCount" must be at most 12',
  })
  @IsNotEmpty({ message: 'Property "buttonsCount" cannot be empty' })
  buttonsCount!: number;
}
