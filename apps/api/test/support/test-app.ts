import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { Role } from '../../src/modules/iam/role.entity';
import { UsersService } from '../../src/modules/iam/users.service';

export interface TestApp {
  app: INestApplication;
  loginAs(email: string, password: string): Promise<string>;
  close(): Promise<void>;
}

const SEED_ROLES = [
  { name: 'admin', permissions: ['*'] },
  {
    // Everything a sales clerk needs, but NOT purchase_order:receive.
    name: 'sales',
    permissions: [
      'product:create',
      'supplier:create',
      'purchase_order:create',
      'customer:create',
      'sales_order:create',
      'sales_order:confirm',
    ],
  },
];

const SEED_USERS = [
  { email: 'admin@test.local', password: 'pw', roles: ['admin'] },
  { email: 'sales@test.local', password: 'pw', roles: ['sales'] },
];

export async function startTestApp(): Promise<TestApp> {
  const container = await new PostgreSqlContainer('postgres:16-alpine').start();
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = String(container.getFirstMappedPort());
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_NAME = container.getDatabase();

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();

  const roles = app.get(DataSource).getRepository(Role);
  for (const role of SEED_ROLES) {
    await roles.save(role);
  }
  const users = app.get(UsersService);
  for (const user of SEED_USERS) {
    await users.create(user.email, user.password, user.roles);
  }

  return {
    app,
    async loginAs(email, password) {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password })
        .expect(200);
      return response.body.accessToken as string;
    },
    async close() {
      await app.close();
      await container.stop();
    },
  };
}
