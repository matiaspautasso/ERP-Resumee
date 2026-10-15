import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRunner } from '../../database/transaction-runner';
import { StockLedger } from '../inventory/stock-ledger';
import { Supplier } from './supplier.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { assertReceivable } from './purchase-order.rules';

@Injectable()
export class PurchasingService {
  constructor(
    @InjectRepository(Supplier) private readonly suppliers: Repository<Supplier>,
    @InjectRepository(PurchaseOrder) private readonly orders: Repository<PurchaseOrder>,
    private readonly tx: TransactionRunner,
    private readonly ledger: StockLedger,
  ) {}

  createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
    return this.suppliers.save(this.suppliers.create(dto));
  }

  createOrder(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const order = this.orders.create({
      supplierId: dto.supplierId,
      status: 'placed',
      lines: dto.lines.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitCost: line.unitCost,
      })),
    });
    return this.orders.save(order);
  }

  /** Receiving brings stock in: one inbound movement per line, atomically with the status change. */
  receive(orderId: string): Promise<PurchaseOrder> {
    return this.tx.run(async (manager) => {
      const order = await manager.findOne(PurchaseOrder, { where: { id: orderId } });
      if (!order) {
        throw new NotFoundException(`Purchase order ${orderId} not found`);
      }
      assertReceivable(order.status);

      for (const line of order.lines) {
        await this.ledger.recordInbound(
          manager,
          line.productId,
          line.quantity,
          'purchase_receipt',
          order.id,
        );
      }

      order.status = 'received';
      return manager.save(order);
    });
  }
}
