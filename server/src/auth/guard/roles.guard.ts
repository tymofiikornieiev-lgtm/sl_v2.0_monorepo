import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from '../../constants/constants';
import { ActiveUserType } from '../interfaces/active-user-type.interfaces';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/interfaces/user-role.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: ActiveUserType;
    }>();
    const role = request.user?.role;

    return !!role && requiredRoles.includes(role);
  }
}
