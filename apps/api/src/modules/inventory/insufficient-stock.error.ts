/** Raised when an outbound movement would drive a product's QuantityOnHand below zero. */
export class InsufficientStockError extends Error {
  constructor(
    readonly productId: string,
    readonly onHand: number,
    readonly requested: number,
  ) {
    super(`Insufficient stock for product ${productId}: on hand ${onHand}, requested ${requested}`);
    this.name = 'InsufficientStockError';
  }
}
