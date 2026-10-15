import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { entities } from './entities';

export function buildDataSourceOptions(): DataSourceOptions {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  // Explicit opt-in via DB_SYNCHRONIZE; otherwise auto-sync everywhere except production.
  // A real production deployment keeps this false and runs explicit migrations instead.
  const synchronize =
    process.env.DB_SYNCHRONIZE !== undefined
      ? process.env.DB_SYNCHRONIZE === 'true'
      : nodeEnv !== 'production';

  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'erp',
    password: process.env.DB_PASSWORD ?? 'erp',
    database: process.env.DB_NAME ?? 'erp',
    entities,
    synchronize,
    logging: false,
  };
}

/** Used by the TypeORM CLI for migrations. */
export default new DataSource(buildDataSourceOptions());
