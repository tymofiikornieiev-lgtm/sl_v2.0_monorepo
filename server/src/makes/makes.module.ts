import { Module } from '@nestjs/common';
import { MakesService } from './makes.service';
import { MakesController } from './makes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Make from './entities/make.entity';

@Module({
  controllers: [MakesController],
  providers: [MakesService],
  imports: [TypeOrmModule.forFeature([Make])],
})
export class MakesModule {}
