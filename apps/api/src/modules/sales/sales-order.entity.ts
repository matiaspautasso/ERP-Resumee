import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { SalesOrderLine } from './sales-order-line.entity';
import { SalesOrderStatus } from './sales-order.rules';

@Entity('sales_orders')
export class SalesOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @Column({ type: 'varchar', default: 'draft' })
  status: SalesOrderStatus;

  @OneToMany(() => SalesOrderLine, (line) => line.salesOrder, { cascade: true, eager: true })
  lines: SalesOrderLine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
