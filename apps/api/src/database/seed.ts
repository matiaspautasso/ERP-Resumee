import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Role } from '../modules/iam/role.entity';
import { UsersService } from '../modules/iam/users.service';

const ROLES: { name: string; permissions: string[] }[] = [
  { name: 'admin', permissions: ['*'] },
  {
    name: 'warehouse_operator',
    permissions: [
      'product:create',
      'supplier:create',
      'purchase_order:create',
      'purchase_order:receive',
    ],
  },
  {
    name: 'sales_clerk',
    permissions: ['customer:create', 'sales_order:create', 'sales_order:confirm'],
  },
];

const USERS: { email: string; password: string; roles: string[] }[] = [
  { email: 'admin@erp.local', password: 'Admin123!', roles: ['admin'] },
  { email: 'warehouse@erp.local', password: 'Warehouse123!', roles: ['warehouse_operator'] },
  { email: 'sales@erp.local', password: 'Sales123!', roles: ['sales_clerk'] },
];

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const roles = app.get(DataSource).getRepository(Role);
  const users = app.get(UsersService);

  for (const role of ROLES) {
    const existing = await roles.findOne({ where: { name: role.name } });
    await roles.save({ ...existing, name: role.name, permissions: role.permissions });
  }

  for (const user of USERS) {
    if (!(await users.findByEmail(user.email))) {
      await users.create(user.email, user.password, user.roles);
    }
  }

  console.log(`Seeded ${ROLES.length} roles and ${USERS.length} users.`);
  await app.close();
}

void seed();
