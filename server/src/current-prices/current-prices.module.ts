import { Module } from '@nestjs/common';
import { CurrentPricesService } from './current-prices.service';
import { CurrentPricesController } from './current-prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import CurrentPrice from './entity/current-price.entity';

@Module({
  controllers: [CurrentPricesController],
  providers: [CurrentPricesService],
  imports: [TypeOrmModule.forFeature([CurrentPrice])],
})
export class CurrentPricesModule {}
