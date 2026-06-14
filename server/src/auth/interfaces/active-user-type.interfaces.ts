import { UserRole } from '../../users/interfaces/user-role.interface';

export interface ActiveUserType {
  sub: number;
  email: string;
  role: UserRole;
}
