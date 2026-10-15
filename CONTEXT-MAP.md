# Context Map

A modular-monolith ERP. Each bounded context is a NestJS module under `apps/api/src/modules`
and owns its own `CONTEXT.md`. Shared value types live in `packages/shared`.

## Contexts

- [Inventory](./apps/api/src/modules/inventory/CONTEXT.md): source of truth for products and stock. Owns the append-only stock ledger.
- [Purchasing](./apps/api/src/modules/purchasing/CONTEXT.md): orders goods from suppliers; receiving brings stock in.
- [Sales](./apps/api/src/modules/sales/CONTEXT.md): orders goods to customers; confirming takes stock out.
- [IAM](./apps/api/src/modules/iam/CONTEXT.md): identity and access. Owns users, roles, and permissions.

## Relationships

- **Purchasing → Inventory**: receiving a `PurchaseOrder` creates inbound `StockMovement`s. Purchasing calls Inventory inside one ACID transaction.
- **Sales → Inventory**: confirming a `SalesOrder` creates outbound `StockMovement`s, guarded by the non-negative-stock rule, inside one ACID transaction.
- **IAM → all**: every state-changing command is authorized by a `Permission` (`resource:action`) before it runs. Other contexts reference the acting `User` by id only.
- **Shared types**: `ProductId`, `Money`, and `Quantity` are defined once in `packages/shared` and referenced by every context.
