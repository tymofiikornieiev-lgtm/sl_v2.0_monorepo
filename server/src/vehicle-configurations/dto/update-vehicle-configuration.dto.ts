import { PartialType } from '@nestjs/mapped-types';
import CreateVehicleConfigurationDto from './create-vehicle-configuration.dto';

export default class UpdateVehicleConfigurationDto extends PartialType(
  CreateVehicleConfigurationDto,
) {}
