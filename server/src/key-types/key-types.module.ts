import { Module } from '@nestjs/common';
import { KeyTypesService } from './key-types.service';
import { KeyTypeController } from './key-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import KeyType from './entities/key-type.entity';

@Module({
  controllers: [KeyTypeController],
  providers: [KeyTypesService],
  imports: [TypeOrmModule.forFeature([KeyType])],
})
export class KeyTypesModule {}
