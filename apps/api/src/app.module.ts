import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationPipe } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loadConfiguration } from './config/configuration';
import { buildDataSourceOptions } from './database/data-source';
import { DatabaseModule } from './database/database.module';
import { DomainExceptionFilter } from './common/domain-exception.filter';
import { HealthModule } from './health/health.module';
import { IamModule } from './modules/iam/iam.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PurchasingModule } from './modules/purchasing/purchasing.module';
import { SalesModule } from './modules/sales/sales.module';
import { JwtAuthGuard } from './modules/iam/jwt-auth.guard';
import { PermissionsGuard } from './modules/iam/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [loadConfiguration] }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        redact: ['req.headers.authorization'],
      },
    }),
    TypeOrmModule.forRootAsync({ useFactory: buildDataSourceOptions }),
    DatabaseModule,
    HealthModule,
    IamModule,
    InventoryModule,
    PurchasingModule,
    SalesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
