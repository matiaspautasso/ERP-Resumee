import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessPolicy, PermissionDeniedError } from './access-policy';
import { AuthenticatedUser } from './authenticated-user';
import { PERMISSIONS_KEY } from './auth.decorators';

/** Enforces the @RequirePermissions metadata using the pure AccessPolicy evaluator. */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }

    const user = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>().user;
    const granted = user?.permissions ?? [];

    try {
      for (const permission of required) {
        AccessPolicy.authorize(granted, permission);
      }
      return true;
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
