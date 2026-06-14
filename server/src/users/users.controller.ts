import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './interfaces/user-role.interface';
import UpdateUserRoleDto from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  public async getAll() {
    return await this.usersService.getAllUsers();
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  public async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return await this.usersService.updateUserRole(id, dto.role);
  }
}
