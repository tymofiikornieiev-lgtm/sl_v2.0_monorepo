import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CurrentPrice from './entity/current-price.entity';
import { Repository } from 'typeorm';
import { CreateCurrentPriceDto } from './dto/create-current-price.dto';
import { UpdateCurrentPriceDto } from './dto/update-current-price.dto';
import { SearchCurrentPriceDto } from './dto/search-current-price.dto';

@Injectable()
export class CurrentPricesService {
  constructor(
    @InjectRepository(CurrentPrice)
    private readonly currentPriceRepository: Repository<CurrentPrice>,
  ) {}

  public async createCurrentPrice(dto: CreateCurrentPriceDto) {
    const newCurrentPrice = this.currentPriceRepository.create(dto);
    return await this.currentPriceRepository.save(newCurrentPrice);
  }

  public async findAll(filters?: SearchCurrentPriceDto) {
    const query = this.currentPriceRepository
      .createQueryBuilder('currentPrice')
      .leftJoinAndSelect(
        'currentPrice.vehicleConfiguration',
        'vehicleConfiguration',
      )
      .leftJoinAndSelect('currentPrice.dealer', 'dealer')
      .leftJoinAndSelect('vehicleConfiguration.make', 'make')
      .leftJoinAndSelect('vehicleConfiguration.model', 'model')
      .leftJoinAndSelect('vehicleConfiguration.ignitionType', 'ignitionType')
      .leftJoinAndSelect('vehicleConfiguration.keyType', 'keyType')
      .leftJoinAndSelect('currentPrice.createdByUser', 'createdByUser')
      .leftJoinAndSelect('currentPrice.updatedByUser', 'updatedByUser')
      .orderBy('currentPrice.updatedAt', 'DESC');

    if (filters?.year) {
      query.andWhere('vehicleConfiguration.year = :year', {
        year: filters.year,
      });
    }

    if (filters?.make) {
      query.andWhere('make.name ILIKE :make', {
        make: `%${filters.make.trim()}%`,
      });
    }

    if (filters?.model) {
      query.andWhere('model.name ILIKE :model', {
        model: `%${filters.model.trim()}%`,
      });
    }

    if (filters?.typeOfKey) {
      query.andWhere('keyType.name ILIKE :typeOfKey', {
        typeOfKey: `%${filters.typeOfKey.trim()}%`,
      });
    }

    if (filters?.typeOfIgnition) {
      query.andWhere('ignitionType.name ILIKE :typeOfIgnition', {
        typeOfIgnition: `%${filters.typeOfIgnition.trim()}%`,
      });
    }

    if (filters?.dealerId) {
      query.andWhere('currentPrice.dealerId = :dealerId', {
        dealerId: filters.dealerId,
      });
    }

    return await query.getMany();
  }

  public async findFilterOptions() {
    const currentYear = new Date().getFullYear();

    const rows = await this.currentPriceRepository
      .createQueryBuilder('currentPrice')
      .innerJoin('currentPrice.vehicleConfiguration', 'vehicleConfiguration')
      .innerJoin('vehicleConfiguration.make', 'make')
      .innerJoin('vehicleConfiguration.model', 'model')
      .innerJoin('vehicleConfiguration.ignitionType', 'ignitionType')
      .innerJoin('vehicleConfiguration.keyType', 'keyType')
      .select('DISTINCT vehicleConfiguration.year', 'year')
      .addSelect('make.name', 'make')
      .addSelect('model.name', 'model')
      .addSelect('keyType.name', 'typeOfKey')
      .addSelect('ignitionType.name', 'typeOfIgnition')
      .where('vehicleConfiguration.year <= :currentYear', { currentYear })
      .orderBy('vehicleConfiguration.year', 'DESC')
      .addOrderBy('make.name', 'ASC')
      .addOrderBy('model.name', 'ASC')
      .addOrderBy('keyType.name', 'ASC')
      .addOrderBy('ignitionType.name', 'ASC')
      .getRawMany<{
        year: string;
        make: string;
        model: string;
        typeOfKey: string;
        typeOfIgnition: string;
      }>();

    return rows.map((row) => ({
      ...row,
      year: Number(row.year),
    }));
  }

  public async findOne(id: number) {
    const currentPrice = await this.currentPriceRepository.findOne({
      where: { id },
      relations: {
        vehicleConfiguration: true,
        dealer: true,
        createdByUser: true,
        updatedByUser: true,
      },
    });

    if (!currentPrice) {
      throw new NotFoundException(`CurrentPrice with id=${id} not found`);
    }

    return currentPrice;
  }

  public async updateCurrentPrice(id: number, dto: UpdateCurrentPriceDto) {
    const entity = await this.currentPriceRepository.preload({
      id,
      ...dto,
    });

    if (!entity) {
      throw new NotFoundException(`CurrentPrice with id=${id} not found`);
    }

    return await this.currentPriceRepository.save(entity);
  }

  public async remove(id: number) {
    const currentPrice = await this.findOne(id);
    await this.currentPriceRepository.remove(currentPrice);

    return { success: true };
  }

  //
  // UPSERT SERVICE
  // public async upsertCurrentPrice(dto: CreateCurrentPriceDto) {
  //   const currentPrice = this.currentPriceRepository.create(dto);

  //   await this.currentPriceRepository.upsert(currentPrice, [
  //     'vehicleConfigurationId',
  //     'dealerId',
  //   ]);

  //   return await this.currentPriceRepository.findOne({
  //     where: {
  //       vehicleConfigurationId: dto.vehicleConfigurationId,
  //       dealerId: dto.dealerId,
  //     },
  //   });
  // }
}
