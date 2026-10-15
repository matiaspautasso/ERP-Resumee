import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from '../inventory/inventory.module';
import { Customer } from './customer.entity';
import { SalesOrder } from './sales-order.entity';
import { SalesOrderLine } from './sales-order-line.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, SalesOrder, SalesOrderLine]), InventoryModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
