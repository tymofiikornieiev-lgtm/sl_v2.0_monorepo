import { Module } from '@nestjs/common';
import { DealersService } from './dealers.service';
import { DealersController } from './dealers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Dealer from './entities/dealer.entity';

@Module({
  controllers: [DealersController],
  providers: [DealersService],
  imports: [TypeOrmModule.forFeature([Dealer])],
})
export class DealersModule {}
