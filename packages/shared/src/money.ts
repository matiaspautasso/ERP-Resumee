/**
 * An amount of money in the minor units of a single currency (e.g. cents).
 * Always a non-negative integer, so arithmetic never drifts with floating point.
 */
export class Money {
  private constructor(public readonly minorUnits: number) {}

  static fromMinorUnits(minorUnits: number): Money {
    if (!Number.isInteger(minorUnits)) {
      throw new Error('Money requires an integer amount of minor units');
    }
    if (minorUnits < 0) {
      throw new Error('Money cannot be negative');
    }
    return new Money(minorUnits);
  }

  add(other: Money): Money {
    return Money.fromMinorUnits(this.minorUnits + other.minorUnits);
  }

  multiply(factor: number): Money {
    if (!Number.isInteger(factor) || factor < 0) {
      throw new Error('Money can only be multiplied by a non-negative integer');
    }
    return Money.fromMinorUnits(this.minorUnits * factor);
  }

  /** Formats as a two-decimal major-unit string, e.g. 1050 minor units -> "10.50". */
  format(): string {
    return (this.minorUnits / 100).toFixed(2);
  }
}
