import { Module } from '@nestjs/common';
import { VehicleConfigurationsService } from './vehicle-configurations.service';
import { VehicleConfigurationsController } from './vehicle-configurations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import VehicleConfiguration from './entities/vehicle-configuration.entity';

@Module({
  controllers: [VehicleConfigurationsController],
  providers: [VehicleConfigurationsService],
  imports: [TypeOrmModule.forFeature([VehicleConfiguration])],
})
export class VehicleConfigurationsModule {}
