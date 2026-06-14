import { Module } from '@nestjs/common';
import { IgnitionTypesService } from './ignition-types.service';
import { IgnitionTypesController } from './ignition-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import IgnitionType from './entities/ignition-type.entity';

@Module({
  controllers: [IgnitionTypesController],
  providers: [IgnitionTypesService],
  imports: [TypeOrmModule.forFeature([IgnitionType])],
})
export class IgnitionTypesModule {}
