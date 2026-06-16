import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CurrentPrice from './entity/current-price.entity';
import { Repository } from 'typeorm';
import { CreateCurrentPriceDto } from './dto/create-current-price.dto';
import { UpdateCurrentPriceDto } from './dto/update-current-price.dto';
import { SearchCurrentPriceDto } from './dto/search-current-price.dto';

@Injectable()
export class CurrentPricesService {
  private readonly logger = new Logger(CurrentPricesService.name);

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
    try {
      const currentYear = new Date().getFullYear();
      const rawRows = await this.currentPriceRepository
        .createQueryBuilder('currentPrice')
        .leftJoin('currentPrice.vehicleConfiguration', 'vehicleConfiguration')
        .leftJoin('vehicleConfiguration.make', 'make')
        .leftJoin('vehicleConfiguration.model', 'model')
        .leftJoin('vehicleConfiguration.keyType', 'keyType')
        .leftJoin('vehicleConfiguration.ignitionType', 'ignitionType')
        .select('vehicleConfiguration.year', 'year')
        .addSelect('make.name', 'make')
        .addSelect('model.name', 'model')
        .addSelect('keyType.name', 'typeOfKey')
        .addSelect('ignitionType.name', 'typeOfIgnition')
        .where('vehicleConfiguration.year <= :currentYear', { currentYear })
        .andWhere('make.name IS NOT NULL')
        .andWhere('model.name IS NOT NULL')
        .andWhere('keyType.name IS NOT NULL')
        .andWhere('ignitionType.name IS NOT NULL')
        .distinct(true)
        .orderBy('vehicleConfiguration.year', 'DESC')
        .addOrderBy('make.name', 'ASC')
        .addOrderBy('model.name', 'ASC')
        .addOrderBy('keyType.name', 'ASC')
        .addOrderBy('ignitionType.name', 'ASC')
        .getRawMany<{
          year: string | number;
          make: string;
          model: string;
          typeOfKey: string;
          typeOfIgnition: string;
        }>();

      return rawRows
        .map((row) => ({
          year: Number(row.year),
          make: row.make,
          model: row.model,
          typeOfKey: row.typeOfKey,
          typeOfIgnition: row.typeOfIgnition,
        }))
        .filter((row) => Number.isFinite(row.year));
    } catch (error) {
      this.logger.error('Failed to load filter options', error);
      throw new InternalServerErrorException('Failed to load filter options');
    }
  }

  public async findOne(id: number) {
    const currentPrice = await this.currentPriceRepository.findOne({
      where: { id },
      relations: {
        vehicleConfiguration: {
          make: true,
          model: true,
          ignitionType: true,
          keyType: true,
        },
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
