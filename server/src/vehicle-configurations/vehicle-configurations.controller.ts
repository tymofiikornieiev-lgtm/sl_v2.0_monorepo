import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VehicleConfigurationsService } from './vehicle-configurations.service';
import CreateVehicleConfigurationDto from './dto/create-vehicle-configuration.dto';
import UpdateVehicleConfigurationDto from './dto/update-vehicle-configuration.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/interfaces/user-role.interface';

@Controller('vehicle-configurations')
export class VehicleConfigurationsController {
  constructor(
    private readonly vehicleConfigurationsService: VehicleConfigurationsService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findAll() {
    return await this.vehicleConfigurationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.vehicleConfigurationsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async create(@Body() dto: CreateVehicleConfigurationDto) {
    return await this.vehicleConfigurationsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleConfigurationDto,
  ) {
    return await this.vehicleConfigurationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.vehicleConfigurationsService.remove(id);
  }
}
