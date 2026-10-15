export type SalesOrderStatus = 'draft' | 'confirmed' | 'cancelled';

/** Raised when a sales order is confirmed from a state the rules forbid. */
export class SalesOrderNotConfirmableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SalesOrderNotConfirmableError';
  }
}

/**
 * A sales order may only be confirmed from draft, and only when it has something to sell.
 * Pure rule: it decides nothing about stock or persistence, so it is unit-tested directly.
 */
export function assertConfirmable(order: { status: SalesOrderStatus; lineCount: number }): void {
  if (order.status !== 'draft') {
    throw new SalesOrderNotConfirmableError(
      `Only a draft sales order can be confirmed (was ${order.status})`,
    );
  }
  if (order.lineCount < 1) {
    throw new SalesOrderNotConfirmableError(
      'A sales order must have at least one line to be confirmed',
    );
  }
}
