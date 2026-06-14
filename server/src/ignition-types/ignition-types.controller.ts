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
import { IgnitionTypesService } from './ignition-types.service';
import CreateIgnitionTypeDto from './dto/create-ignition-type.dto';
import UpdateIgnitionTypeDto from './dto/update-ignition-type.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/interfaces/user-role.interface';

@Controller('ignition-types')
export class IgnitionTypesController {
  constructor(private readonly ignitionTypesService: IgnitionTypesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findAll() {
    return await this.ignitionTypesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ignitionTypesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async create(@Body() dto: CreateIgnitionTypeDto) {
    return await this.ignitionTypesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIgnitionTypeDto,
  ) {
    return await this.ignitionTypesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ignitionTypesService.remove(id);
  }
}
