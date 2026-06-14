import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserType } from '../interfaces/active-user-type.interfaces';

export const ActiveUser = createParamDecorator<
  keyof ActiveUserType | undefined
>((field, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<{
    user: ActiveUserType;
  }>();

  const user = request.user;

  return field ? user[field] : user;
});
