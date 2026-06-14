import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrentPriceDto } from './create-current-price.dto';

export class UpdateCurrentPriceDto extends PartialType(CreateCurrentPriceDto) {}
