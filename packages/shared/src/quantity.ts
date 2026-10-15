/**
 * A non-negative integer count of a product. Zero is allowed (a product can be out of stock);
 * business rules that require "at least one" live with the orders, not here.
 */
export class Quantity {
  private constructor(public readonly value: number) {}

  static fromInteger(value: number): Quantity {
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
    return new Quantity(value);
  }
}
