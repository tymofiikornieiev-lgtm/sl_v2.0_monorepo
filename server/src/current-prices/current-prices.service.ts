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

      const rows = await this.currentPriceRepository.query(
        `
          SELECT DISTINCT
            vc.year::int AS year,
            mk.name AS make,
            md.name AS model,
            kt.name AS "typeOfKey",
            it.name AS "typeOfIgnition"
          FROM current_prices cp
          JOIN vehicle_configurations vc
            ON vc.id = cp.vehicle_configuration_id
          JOIN makes mk
            const currentYear = new Date().getFullYear();
            const rows = await this.currentPriceRepository.find({
              relations: {
                vehicleConfiguration: {
                  make: true,
                  model: true,
                  keyType: true,
                  ignitionType: true,
                },
              },
            });

            const seen = new Set<string>();
            const options: Array<{
              year: number;
              make: string;
              model: string;
              typeOfKey: string;
              typeOfIgnition: string;
            }> = [];

            for (const row of rows) {
              const vc = row.vehicleConfiguration;

              if (!vc?.make?.name || !vc?.model?.name || !vc?.keyType?.name || !vc?.ignitionType?.name) {
                continue;
              }

              const year = Number(vc.year);
              if (!Number.isFinite(year) || year > currentYear) {
                continue;
              }

              const key = `${year}|${vc.make.name}|${vc.model.name}|${vc.keyType.name}|${vc.ignitionType.name}`;
              if (seen.has(key)) {
                continue;
              }

              seen.add(key);
              options.push({
                year,
                make: vc.make.name,
                model: vc.model.name,
                typeOfKey: vc.keyType.name,
                typeOfIgnition: vc.ignitionType.name,
              });
            }

            options.sort((a, b) => {
              if (a.year !== b.year) return b.year - a.year;
              if (a.make !== b.make) return a.make.localeCompare(b.make);
              if (a.model !== b.model) return a.model.localeCompare(b.model);
              if (a.typeOfKey !== b.typeOfKey) return a.typeOfKey.localeCompare(b.typeOfKey);
              return a.typeOfIgnition.localeCompare(b.typeOfIgnition);
            });

            return options;
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
