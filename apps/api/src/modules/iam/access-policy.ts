/** Raised when a user attempts an action they lack the permission for. */
export class PermissionDeniedError extends Error {
  constructor(required: string) {
    super(`Missing permission: ${required}`);
    this.name = 'PermissionDeniedError';
  }
}

/**
 * Decides whether a set of granted permissions allows a required `resource:action`.
 * Pure: it knows nothing about HTTP, users, or the database, so it is tested in isolation
 * and reused by the HTTP guard.
 */
export class AccessPolicy {
  static authorize(grantedPermissions: readonly string[], required: string): void {
    const permitted = grantedPermissions.includes('*') || grantedPermissions.includes(required);
    if (!permitted) {
      throw new PermissionDeniedError(required);
    }
  }
}
