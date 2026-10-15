import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('purchase_order_lines')
export class PurchaseOrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrder, (order) => order.lines, { onDelete: 'CASCADE' })
  purchaseOrder: PurchaseOrder;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  /** Agreed purchase cost per unit, in minor units. */
  @Column({ type: 'int', name: 'unit_cost' })
  unitCost: number;
}
