import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/expense-tracker-client';
import { ROLES_KEY } from 'src/auth/guards/roles.guard';

export interface AuthRequest extends Request {
  user: {
    id: string;
    organizationId: string;
    role: Role;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthRequest>();
    return requiredRoles.some((role) => role === user.role);
  }
}
