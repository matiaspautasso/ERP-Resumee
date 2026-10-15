import { Product } from '../modules/inventory/product.entity';
import { StockMovement } from '../modules/inventory/stock-movement.entity';
import { Supplier } from '../modules/purchasing/supplier.entity';
import { PurchaseOrder } from '../modules/purchasing/purchase-order.entity';
import { PurchaseOrderLine } from '../modules/purchasing/purchase-order-line.entity';
import { Customer } from '../modules/sales/customer.entity';
import { SalesOrder } from '../modules/sales/sales-order.entity';
import { SalesOrderLine } from '../modules/sales/sales-order-line.entity';
import { User } from '../modules/iam/user.entity';
import { Role } from '../modules/iam/role.entity';

export const entities = [
  Product,
  StockMovement,
  Supplier,
  PurchaseOrder,
  PurchaseOrderLine,
  Customer,
  SalesOrder,
  SalesOrderLine,
  User,
  Role,
];
