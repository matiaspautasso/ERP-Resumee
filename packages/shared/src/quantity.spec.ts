import { Quantity } from './quantity';

describe('Quantity', () => {
  it('is created from a non-negative integer', () => {
    expect(Quantity.fromInteger(7).value).toBe(7);
  });

  it('allows zero', () => {
    expect(Quantity.fromInteger(0).value).toBe(0);
  });

  it('rejects a non-integer', () => {
    expect(() => Quantity.fromInteger(2.5)).toThrow('Quantity must be an integer');
  });

  it('rejects a negative value', () => {
    expect(() => Quantity.fromInteger(-3)).toThrow('Quantity cannot be negative');
  });
});
