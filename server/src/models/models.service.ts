import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import Model from './entities/model.entity';
import CreateModelDto from './dto/create-model.dto';
import UpdateModelDto from './dto/update-model.dto';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelsRepository: Repository<Model>,
  ) {}

  public async create(dto: CreateModelDto) {
    const normalizedName = dto.name.trim();
    const existing = await this.modelsRepository.findOne({
      where: {
        makeId: dto.makeId,
        name: ILike(normalizedName),
      },
    });

    if (existing) {
      return existing;
    }

    const model = this.modelsRepository.create({
      ...dto,
      name: normalizedName,
    });
    return await this.modelsRepository.save(model);
  }

  public async findAll() {
    return await this.modelsRepository.find({
      relations: { make: true },
      order: { name: 'ASC' },
    });
  }

  public async findOne(id: number) {
    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: { make: true },
    });

    if (!model) {
      throw new NotFoundException(`Model with id=${id} not found`);
    }

    return model;
  }

  public async update(id: number, dto: UpdateModelDto) {
    const model = await this.modelsRepository.preload({ id, ...dto });
    if (!model) {
      throw new NotFoundException(`Model with id=${id} not found`);
    }

    const normalizedName = dto.name?.trim() ?? model.name;
    const targetMakeId = dto.makeId ?? model.makeId;
    const existing = await this.modelsRepository.findOne({
      where: {
        makeId: targetMakeId,
        name: ILike(normalizedName),
      },
    });

    if (existing && existing.id !== id) {
      throw new ConflictException(
        'Model with this name already exists for this make',
      );
    }

    model.name = normalizedName;

    return await this.modelsRepository.save(model);
  }

  public async remove(id: number) {
    const model = await this.findOne(id);
    await this.modelsRepository.remove(model);

    return { success: true };
  }
}
