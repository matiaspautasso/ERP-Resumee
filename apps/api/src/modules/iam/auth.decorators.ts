import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const PERMISSIONS_KEY = 'requiredPermissions';

/** Marks a route as reachable without authentication (e.g. login). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Declares the `resource:action` permissions a route requires. */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
