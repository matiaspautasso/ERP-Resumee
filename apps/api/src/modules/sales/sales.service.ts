import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRunner } from '../../database/transaction-runner';
import { StockLedger } from '../inventory/stock-ledger';
import { Customer } from './customer.entity';
import { SalesOrder } from './sales-order.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';
import { assertConfirmable } from './sales-order.rules';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Customer) private readonly customers: Repository<Customer>,
    @InjectRepository(SalesOrder) private readonly orders: Repository<SalesOrder>,
    private readonly tx: TransactionRunner,
    private readonly ledger: StockLedger,
  ) {}

  createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    return this.customers.save(this.customers.create(dto));
  }

  createOrder(dto: CreateSalesOrderDto): Promise<SalesOrder> {
    const order = this.orders.create({
      customerId: dto.customerId,
      status: 'draft',
      lines: dto.lines.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    });
    return this.orders.save(order);
  }

  /**
   * Confirming takes stock out: one outbound movement per line, atomically with the status
   * change. If any line would drive stock negative, the StockLedger throws and the whole
   * transaction rolls back, leaving the order a draft with no movements.
   */
  confirm(orderId: string): Promise<SalesOrder> {
    return this.tx.run(async (manager) => {
      const order = await manager.findOne(SalesOrder, { where: { id: orderId } });
      if (!order) {
        throw new NotFoundException(`Sales order ${orderId} not found`);
      }
      assertConfirmable({ status: order.status, lineCount: order.lines.length });

      for (const line of order.lines) {
        await this.ledger.recordOutbound(
          manager,
          line.productId,
          line.quantity,
          'sales_confirmation',
          order.id,
        );
      }

      order.status = 'confirmed';
      return manager.save(order);
    });
  }
}
