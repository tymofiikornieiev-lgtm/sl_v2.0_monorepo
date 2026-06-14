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
import { ModelsService } from './models.service';
import CreateModelDto from './dto/create-model.dto';
import UpdateModelDto from './dto/update-model.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/interfaces/user-role.interface';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findAll() {
    return await this.modelsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.modelsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async create(@Body() dto: CreateModelDto) {
    return await this.modelsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateModelDto,
  ) {
    return await this.modelsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.modelsService.remove(id);
  }
}
