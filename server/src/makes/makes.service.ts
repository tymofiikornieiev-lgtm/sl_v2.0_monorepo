import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import Make from './entities/make.entity';
import CreateMakeDto from './dto/create-make.dto';
import UpdateMakeDto from './dto/update-make.dto';

@Injectable()
export class MakesService {
  constructor(
    @InjectRepository(Make)
    private readonly makesRepository: Repository<Make>,
  ) {}

  public async create(dto: CreateMakeDto) {
    const normalizedName = dto.name.trim();
    const existing = await this.makesRepository.findOne({
      where: { name: ILike(normalizedName) },
    });

    if (existing) {
      return existing;
    }

    const make = this.makesRepository.create({ ...dto, name: normalizedName });
    return await this.makesRepository.save(make);
  }

  public async findAll() {
    return await this.makesRepository.find({ order: { name: 'ASC' } });
  }

  public async findOne(id: number) {
    const make = await this.makesRepository.findOne({ where: { id } });
    if (!make) {
      throw new NotFoundException(`Make with id=${id} not found`);
    }

    return make;
  }

  public async update(id: number, dto: UpdateMakeDto) {
    const normalizedName = dto.name?.trim();
    if (normalizedName) {
      const existing = await this.makesRepository.findOne({
        where: { name: ILike(normalizedName) },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Make with this name already exists');
      }
    }

    const make = await this.makesRepository.preload({ id, ...dto });
    if (!make) {
      throw new NotFoundException(`Make with id=${id} not found`);
    }

    if (normalizedName) {
      make.name = normalizedName;
    }

    return await this.makesRepository.save(make);
  }

  public async remove(id: number) {
    const make = await this.findOne(id);
    await this.makesRepository.remove(make);

    return { success: true };
  }
}
