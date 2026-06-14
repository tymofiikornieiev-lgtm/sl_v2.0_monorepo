import { IsEnum } from 'class-validator';
import { UserRole } from '../interfaces/user-role.interface';

export default class UpdateUserRoleDto {
  @IsEnum(UserRole, {
    message: 'Property "role" must be one of admin, manager, viewer',
  })
  role!: UserRole;
}
