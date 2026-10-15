import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from '../inventory/inventory.module';
import { Supplier } from './supplier.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderLine } from './purchase-order-line.entity';
import { PurchasingService } from './purchasing.service';
import { PurchasingController } from './purchasing.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, PurchaseOrder, PurchaseOrderLine]),
    InventoryModule,
  ],
  controllers: [PurchasingController],
  providers: [PurchasingService],
})
export class PurchasingModule {}
