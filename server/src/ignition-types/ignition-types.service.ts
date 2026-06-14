import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import IgnitionType from './entities/ignition-type.entity';
import CreateIgnitionTypeDto from './dto/create-ignition-type.dto';
import UpdateIgnitionTypeDto from './dto/update-ignition-type.dto';

@Injectable()
export class IgnitionTypesService {
  constructor(
    @InjectRepository(IgnitionType)
    private readonly ignitionTypesRepository: Repository<IgnitionType>,
  ) {}

  public async create(dto: CreateIgnitionTypeDto) {
    const normalizedName = dto.name.trim();
    const existing = await this.ignitionTypesRepository.findOne({
      where: { name: ILike(normalizedName) },
    });

    if (existing) {
      return existing;
    }

    const ignitionType = this.ignitionTypesRepository.create({
      ...dto,
      name: normalizedName,
    });
    return await this.ignitionTypesRepository.save(ignitionType);
  }

  public async findAll() {
    return await this.ignitionTypesRepository.find({ order: { name: 'ASC' } });
  }

  public async findOne(id: number) {
    const ignitionType = await this.ignitionTypesRepository.findOne({
      where: { id },
    });
    if (!ignitionType) {
      throw new NotFoundException(`Ignition type with id=${id} not found`);
    }

    return ignitionType;
  }

  public async update(id: number, dto: UpdateIgnitionTypeDto) {
    const normalizedName = dto.name?.trim();
    if (normalizedName) {
      const existing = await this.ignitionTypesRepository.findOne({
        where: { name: ILike(normalizedName) },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Ignition type with this name already exists',
        );
      }
    }

    const ignitionType = await this.ignitionTypesRepository.preload({
      id,
      ...dto,
    });
    if (!ignitionType) {
      throw new NotFoundException(`Ignition type with id=${id} not found`);
    }

    if (normalizedName) {
      ignitionType.name = normalizedName;
    }

    return await this.ignitionTypesRepository.save(ignitionType);
  }

  public async remove(id: number) {
    const ignitionType = await this.findOne(id);
    await this.ignitionTypesRepository.remove(ignitionType);

    return { success: true };
  }
}
