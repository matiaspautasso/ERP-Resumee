export interface AppConfig {
  nodeEnv: string;
  port: number;
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

/** Reads and normalises environment configuration. Fails fast if a required secret is missing. */
export function loadConfiguration(): AppConfig {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const secret = process.env.JWT_SECRET;

  if (!secret && nodeEnv === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }

  return {
    nodeEnv,
    port: Number(process.env.API_PORT ?? 3000),
    jwt: {
      secret: secret ?? 'dev-only-insecure-secret',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    },
  };
}
