import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import Dealer from './entities/dealer.entity';
import CreateDealerDto from './dto/create-dealer.dto';
import UpdateDealerDto from './dto/update-dealer.dto';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(Dealer)
    private readonly dealersRepository: Repository<Dealer>,
  ) {}

  public async create(dto: CreateDealerDto) {
    const normalizedName = dto.name.trim();
    const existing = await this.dealersRepository.findOne({
      where: { name: ILike(normalizedName) },
    });

    if (existing) {
      return existing;
    }

    const dealer = this.dealersRepository.create({
      ...dto,
      name: normalizedName,
    });
    return await this.dealersRepository.save(dealer);
  }

  public async findAll() {
    return await this.dealersRepository.find({ order: { name: 'ASC' } });
  }

  public async findOne(id: number) {
    const dealer = await this.dealersRepository.findOne({ where: { id } });
    if (!dealer) {
      throw new NotFoundException(`Dealer with id=${id} not found`);
    }

    return dealer;
  }

  public async update(id: number, dto: UpdateDealerDto) {
    const normalizedName = dto.name?.trim();
    if (normalizedName) {
      const existing = await this.dealersRepository.findOne({
        where: { name: ILike(normalizedName) },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Dealer with this name already exists');
      }
    }

    const dealer = await this.dealersRepository.preload({ id, ...dto });
    if (!dealer) {
      throw new NotFoundException(`Dealer with id=${id} not found`);
    }

    if (normalizedName) {
      dealer.name = normalizedName;
    }

    return await this.dealersRepository.save(dealer);
  }

  public async remove(id: number) {
    const dealer = await this.findOne(id);
    await this.dealersRepository.remove(dealer);

    return { success: true };
  }
}
