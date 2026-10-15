import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseOrderLine } from './purchase-order-line.entity';

export type PurchaseOrderStatus = 'draft' | 'placed' | 'received' | 'cancelled';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => Supplier)
  supplier: Supplier;

  @Column({ type: 'varchar', default: 'draft' })
  status: PurchaseOrderStatus;

  @OneToMany(() => PurchaseOrderLine, (line) => line.purchaseOrder, {
    cascade: true,
    eager: true,
  })
  lines: PurchaseOrderLine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
