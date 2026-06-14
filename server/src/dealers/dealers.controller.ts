import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DealersService } from './dealers.service';
import CreateDealerDto from './dto/create-dealer.dto';
import UpdateDealerDto from './dto/update-dealer.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/interfaces/user-role.interface';

@Controller('dealers')
export class DealersController {
  constructor(private readonly dealersService: DealersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findAll() {
    return await this.dealersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.dealersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async create(@Body() dto: CreateDealerDto) {
    return await this.dealersService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDealerDto,
  ) {
    return await this.dealersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.dealersService.remove(id);
  }
}
