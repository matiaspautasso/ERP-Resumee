# Append-only stock ledger; QuantityOnHand is derived

Stock is never stored as a mutable quantity column on Product. Instead every change is an
immutable `StockMovement` (signed), and `QuantityOnHand` is the sum of a product's movements.
This gives a full audit trail, makes corruption under concurrency far harder, and lets purchases
and sales share one mechanism. The trade-off is that reading current stock is a SUM query, which
we keep fast with an index on `(product_id)` and, if needed later, a materialized balance.

## Consequences

- A reader expecting a `Product.quantity` column will not find one; that is deliberate.
- The non-negative-stock rule is checked against the summed balance inside the same transaction that writes the outbound movement.
