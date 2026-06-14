import { PartialType } from '@nestjs/mapped-types';
import CreateMakeDto from './create-make.dto';

export default class UpdateMakeDto extends PartialType(CreateMakeDto) {}
