import { PartialType } from '@nestjs/mapped-types';
import CreateModelDto from './create-model.dto';

export default class UpdateModelDto extends PartialType(CreateModelDto) {}
