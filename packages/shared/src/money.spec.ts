import { Money } from './money';

describe('Money', () => {
  it('is created from a non-negative integer amount of minor units', () => {
    const price = Money.fromMinorUnits(1050);

    expect(price.minorUnits).toBe(1050);
  });

  it('rejects a non-integer amount of minor units', () => {
    expect(() => Money.fromMinorUnits(10.5)).toThrow(
      'Money requires an integer amount of minor units',
    );
  });

  it('rejects a negative amount', () => {
    expect(() => Money.fromMinorUnits(-1)).toThrow('Money cannot be negative');
  });

  it('adds two amounts', () => {
    const total = Money.fromMinorUnits(1050).add(Money.fromMinorUnits(295));

    expect(total.minorUnits).toBe(1345);
  });

  it('multiplies by a non-negative integer factor', () => {
    const lineTotal = Money.fromMinorUnits(500).multiply(3);

    expect(lineTotal.minorUnits).toBe(1500);
  });

  it('rejects multiplication by a non-integer factor', () => {
    expect(() => Money.fromMinorUnits(500).multiply(1.5)).toThrow(
      'Money can only be multiplied by a non-negative integer',
    );
  });

  it('formats minor units as a major-unit decimal string', () => {
    expect(Money.fromMinorUnits(1050).format()).toBe('10.50');
    expect(Money.fromMinorUnits(500).format()).toBe('5.00');
    expect(Money.fromMinorUnits(7).format()).toBe('0.07');
    expect(Money.fromMinorUnits(0).format()).toBe('0.00');
  });
});
