import { AccessPolicy, PermissionDeniedError } from './access-policy';

describe('AccessPolicy', () => {
  it('permits when the exact permission is granted', () => {
    expect(() =>
      AccessPolicy.authorize(['product:create', 'sales_order:confirm'], 'sales_order:confirm'),
    ).not.toThrow();
  });

  it('permits any action when the wildcard "*" is granted', () => {
    expect(() => AccessPolicy.authorize(['*'], 'sales_order:confirm')).not.toThrow();
  });

  it('denies when the required permission is absent', () => {
    expect(() => AccessPolicy.authorize(['product:create'], 'sales_order:confirm')).toThrow(
      PermissionDeniedError,
    );
  });

  it('names the missing permission in the error', () => {
    expect(() => AccessPolicy.authorize([], 'sales_order:confirm')).toThrow('sales_order:confirm');
  });
});
