import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import VehicleConfiguration from './entities/vehicle-configuration.entity';
import CreateVehicleConfigurationDto from './dto/create-vehicle-configuration.dto';
import UpdateVehicleConfigurationDto from './dto/update-vehicle-configuration.dto';

@Injectable()
export class VehicleConfigurationsService {
  constructor(
    @InjectRepository(VehicleConfiguration)
    private readonly vehicleConfigurationsRepository: Repository<VehicleConfiguration>,
  ) {}

  public async create(dto: CreateVehicleConfigurationDto) {
    const vehicleConfiguration =
      this.vehicleConfigurationsRepository.create(dto);
    return await this.vehicleConfigurationsRepository.save(
      vehicleConfiguration,
    );
  }

  public async findAll() {
    return await this.vehicleConfigurationsRepository.find({
      relations: {
        make: true,
        model: true,
        ignitionType: true,
        keyType: true,
      },
      order: { year: 'DESC' },
    });
  }

  public async findOne(id: number) {
    const vehicleConfiguration =
      await this.vehicleConfigurationsRepository.findOne({
        where: { id },
        relations: {
          make: true,
          model: true,
          ignitionType: true,
          keyType: true,
        },
      });

    if (!vehicleConfiguration) {
      throw new NotFoundException(
        `Vehicle configuration with id=${id} not found`,
      );
    }

    return vehicleConfiguration;
  }

  public async update(id: number, dto: UpdateVehicleConfigurationDto) {
    const vehicleConfiguration =
      await this.vehicleConfigurationsRepository.preload({
        id,
        ...dto,
      });
    if (!vehicleConfiguration) {
      throw new NotFoundException(
        `Vehicle configuration with id=${id} not found`,
      );
    }

    return await this.vehicleConfigurationsRepository.save(
      vehicleConfiguration,
    );
  }

  public async remove(id: number) {
    const vehicleConfiguration = await this.findOne(id);
    await this.vehicleConfigurationsRepository.remove(vehicleConfiguration);

    return { success: true };
  }
}
