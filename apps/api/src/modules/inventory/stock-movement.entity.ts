import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

export type MovementReason = 'purchase_receipt' | 'sales_confirmation' | 'manual_correction';

/**
 * An immutable, append-only ledger entry. Stock only ever changes by inserting one of these;
 * rows are never updated or deleted. QuantityOnHand is the SUM of a product's movements.
 */
@Entity('stock_movements')
@Index(['productId'])
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  product: Product;

  /** Signed change: positive is inbound, negative is outbound. */
  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar' })
  reason: MovementReason;

  /** Id of the purchase/sales order that caused this movement, when applicable. */
  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
