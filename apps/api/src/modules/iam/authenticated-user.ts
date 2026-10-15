/** The authenticated principal attached to each request after the JWT is validated. */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  permissions: string[];
}

export interface JwtPayload {
  sub: string;
  email: string;
  permissions: string[];
}
