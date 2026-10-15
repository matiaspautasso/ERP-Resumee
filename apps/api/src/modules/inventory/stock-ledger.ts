import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Product } from './product.entity';
import { StockMovement, MovementReason } from './stock-movement.entity';
import { InsufficientStockError } from './insufficient-stock.error';

/**
 * The only way stock changes. Appends signed movements and derives QuantityOnHand by summing
 * them. Write methods take an EntityManager so the caller owns the transaction (see
 * TransactionRunner); the non-negative invariant is checked against the summed balance inside
 * that same transaction, after locking the product row to serialise concurrent outbound moves.
 */
@Injectable()
export class StockLedger {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async recordInbound(
    manager: EntityManager,
    productId: string,
    quantity: number,
    reason: MovementReason,
    referenceId: string | null = null,
  ): Promise<void> {
    await this.append(manager, productId, Math.abs(quantity), reason, referenceId);
  }

  async recordOutbound(
    manager: EntityManager,
    productId: string,
    quantity: number,
    reason: MovementReason,
    referenceId: string | null = null,
  ): Promise<void> {
    const amount = Math.abs(quantity);
    // Lock the product row so two concurrent confirmations cannot both pass the check.
    await manager.findOne(Product, {
      where: { id: productId },
      lock: { mode: 'pessimistic_write' },
    });

    const onHand = await this.sumMovements(manager, productId);
    if (onHand - amount < 0) {
      throw new InsufficientStockError(productId, onHand, amount);
    }
    await this.append(manager, productId, -amount, reason, referenceId);
  }

  /** Current stock of a product, read outside any caller transaction. */
  getQuantityOnHand(productId: string): Promise<number> {
    return this.sumMovements(this.dataSource.manager, productId);
  }

  private async append(
    manager: EntityManager,
    productId: string,
    signedQuantity: number,
    reason: MovementReason,
    referenceId: string | null,
  ): Promise<void> {
    const movement = manager.create(StockMovement, {
      productId,
      quantity: signedQuantity,
      reason,
      referenceId,
    });
    await manager.save(movement);
  }

  private async sumMovements(manager: EntityManager, productId: string): Promise<number> {
    const result = await manager
      .createQueryBuilder(StockMovement, 'movement')
      .select('COALESCE(SUM(movement.quantity), 0)', 'sum')
      .where('movement.product_id = :productId', { productId })
      .getRawOne<{ sum: string }>();
    return Number(result?.sum ?? 0);
  }
}
