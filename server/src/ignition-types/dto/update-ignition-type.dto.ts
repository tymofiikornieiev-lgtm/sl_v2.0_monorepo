import { PartialType } from '@nestjs/mapped-types';
import CreateIgnitionTypeDto from './create-ignition-type.dto';

export default class UpdateIgnitionTypeDto extends PartialType(
  CreateIgnitionTypeDto,
) {}
