import { assertConfirmable, SalesOrderNotConfirmableError } from './sales-order.rules';

describe('assertConfirmable', () => {
  it('allows a draft order that has at least one line', () => {
    expect(() => assertConfirmable({ status: 'draft', lineCount: 1 })).not.toThrow();
  });

  it('rejects an order that is already confirmed', () => {
    expect(() => assertConfirmable({ status: 'confirmed', lineCount: 2 })).toThrow(
      SalesOrderNotConfirmableError,
    );
  });

  it('rejects a cancelled order', () => {
    expect(() => assertConfirmable({ status: 'cancelled', lineCount: 1 })).toThrow(
      SalesOrderNotConfirmableError,
    );
  });

  it('rejects a draft order with no lines', () => {
    expect(() => assertConfirmable({ status: 'draft', lineCount: 0 })).toThrow('at least one line');
  });
});
