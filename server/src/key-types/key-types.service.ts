import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import KeyType from './entities/key-type.entity';
import CreateKeyTypeDto from './dto/create-key-type.dto';
import UpdateKeyTypeDto from './dto/update-key-type.dto';

@Injectable()
export class KeyTypesService {
  constructor(
    @InjectRepository(KeyType)
    private readonly keyTypesRepository: Repository<KeyType>,
  ) {}

  public async create(dto: CreateKeyTypeDto) {
    const normalizedName = dto.name.trim();
    const existing = await this.keyTypesRepository.findOne({
      where: { name: ILike(normalizedName) },
    });

    if (existing) {
      return existing;
    }

    const keyType = this.keyTypesRepository.create({
      ...dto,
      name: normalizedName,
    });
    return await this.keyTypesRepository.save(keyType);
  }

  public async findAll() {
    return await this.keyTypesRepository.find({ order: { name: 'ASC' } });
  }

  public async findOne(id: number) {
    const keyType = await this.keyTypesRepository.findOne({ where: { id } });
    if (!keyType) {
      throw new NotFoundException(`Key type with id=${id} not found`);
    }

    return keyType;
  }

  public async update(id: number, dto: UpdateKeyTypeDto) {
    const normalizedName = dto.name?.trim();
    if (normalizedName) {
      const existing = await this.keyTypesRepository.findOne({
        where: { name: ILike(normalizedName) },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Key type with this name already exists');
      }
    }

    const keyType = await this.keyTypesRepository.preload({ id, ...dto });
    if (!keyType) {
      throw new NotFoundException(`Key type with id=${id} not found`);
    }

    if (normalizedName) {
      keyType.name = normalizedName;
    }

    return await this.keyTypesRepository.save(keyType);
  }

  public async remove(id: number) {
    const keyType = await this.findOne(id);
    await this.keyTypesRepository.remove(keyType);

    return { success: true };
  }
}
