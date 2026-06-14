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
import { KeyTypesService } from './key-types.service';
import CreateKeyTypeDto from './dto/create-key-type.dto';
import UpdateKeyTypeDto from './dto/update-key-type.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/interfaces/user-role.interface';

@Controller('key-types')
export class KeyTypeController {
  constructor(private readonly keyTypeService: KeyTypesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findAll() {
    return await this.keyTypeService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER)
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.keyTypeService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async create(@Body() dto: CreateKeyTypeDto) {
    return await this.keyTypeService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKeyTypeDto,
  ) {
    return await this.keyTypeService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.keyTypeService.remove(id);
  }
}
