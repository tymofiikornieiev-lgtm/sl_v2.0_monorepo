import { PartialType } from '@nestjs/mapped-types';
import CreateKeyTypeDto from './create-key-type.dto';

export default class UpdateKeyTypeDto extends PartialType(CreateKeyTypeDto) {}
