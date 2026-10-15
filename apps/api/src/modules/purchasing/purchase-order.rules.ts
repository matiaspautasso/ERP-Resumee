import { PurchaseOrderStatus } from './purchase-order.entity';

/** Raised when a purchase order is received from a state the rules forbid. */
export class PurchaseOrderNotReceivableError extends Error {
  constructor(status: PurchaseOrderStatus) {
    super(`Only a placed purchase order can be received (was ${status})`);
    this.name = 'PurchaseOrderNotReceivableError';
  }
}

export function assertReceivable(status: PurchaseOrderStatus): void {
  if (status !== 'placed') {
    throw new PurchaseOrderNotReceivableError(status);
  }
}
