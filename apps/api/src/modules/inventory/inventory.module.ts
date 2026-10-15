import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { StockMovement } from './stock-movement.entity';
import { ProductsService } from './products.service';
import { StockLedger } from './stock-ledger';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StockMovement])],
  controllers: [InventoryController],
  providers: [ProductsService, StockLedger],
  exports: [StockLedger],
})
export class InventoryModule {}
