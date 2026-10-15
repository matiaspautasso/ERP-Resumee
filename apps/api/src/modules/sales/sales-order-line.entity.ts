import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SalesOrder } from './sales-order.entity';

@Entity('sales_order_lines')
export class SalesOrderLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SalesOrder, (order) => order.lines, { onDelete: 'CASCADE' })
  salesOrder: SalesOrder;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  /** Agreed sale price per unit, in minor units. */
  @Column({ type: 'int', name: 'unit_price' })
  unitPrice: number;
}
