# Codebase Design

How the modules are shaped, where the seams are, and how each layer is tested. Vocabulary follows
the deep-module discipline: _module_, _interface_, _implementation_, _seam_, _adapter_, _depth_.

## Deep modules

### `StockLedger` (inventory)

Small interface, large implementation. Everything about how stock is stored and guarded lives here.

- `recordInbound(em, productId, quantity, reason)` — append a positive movement.
- `recordOutbound(em, productId, quantity, reason)` — append a negative movement; **throws `InsufficientStockError`** if it would drive `QuantityOnHand` below zero.
- `getQuantityOnHand(productId): Quantity` — the summed balance.

Behind those three methods: the append-only ledger, the SUM-of-movements computation, and the
non-negative invariant. **Deletion test**: delete it and the summing logic plus the non-negative
check reappear in Purchasing, Sales, and every report. It earns its keep.

It accepts a transaction manager (`em`) rather than creating one — so the caller controls the
atomic scope (see below), and it stays trivially testable through its own interface.

### `SalesOrderService.confirm` (sales)

The deepest behaviour in the slice. Interface: `confirm(orderId, actingUser): SalesOrder`.

Hidden behind one call: authorize the actor, load the order, assert it is Draft with at least one
line, record an outbound movement per line via `StockLedger`, flip status to Confirmed — **all in
one transaction**. Any failure rolls the whole thing back, so there is never a confirmed order with
no stock movement, nor a movement with an unconfirmed order.

### `AccessPolicy` (iam)

Interface: `authorize(user, 'sales_order:confirm')` — throws `ForbiddenError` when the user's roles
do not grant the required `resource:action` permission. The pure evaluator is the implementation; a
NestJS guard is a thin **adapter** that reads route metadata and delegates to it.

### Value modules: `Money`, `Quantity` (shared)

Construct-and-validate value objects. They hide their invariants (integer minor units for `Money`;
non-negative integers for `Quantity`) behind constructors and arithmetic methods, so an invalid
value is unrepresentable rather than guarded at every call site.

## Seams

### The real one that carries the design: `TransactionRunner`

`run(fn: (em) => Promise<T>): Promise<T>` — an **adapter** over TypeORM's QueryRunner that opens a
transaction, passes the entity manager to `fn`, and commits or rolls back. This is a **real seam**,
not hypothetical: it isolates the atomic scope so `confirm` can compose `StockLedger` calls, and so
the rollback behaviour is testable on its own.

### `HTTP` interface (controllers)

A real seam with two adapters that cross it in tests: a Supertest HTTP client (integration) and a
real browser (Playwright E2E). Controllers stay thin; all behaviour sits in the services behind them.

### Rejected seams (would make modules shallow)

Generic `IProductRepository` / `ISalesOrderRepository` ports with in-memory fakes are **not** built.
Integration tests run against real PostgreSQL via Testcontainers, so no second adapter ever exists —
the port would be a hypothetical seam adding interface surface for nothing. We test through the real
adapter (replace-don't-layer).

## Testability mapping (the pyramid)

- **Unit (Jest, no I/O)** — pure logic through its own interface: `Money`, `Quantity`, order
  invariants (`assertDraft`, `assertHasLines`), and `AccessPolicy` permission evaluation.
- **Integration (Jest + Supertest + Testcontainers, real Postgres)** — the confirm-sale happy path,
  insufficient-stock rejection, transaction rollback on a mid-flight failure, and a 403 from the RBAC
  guard. These cross the HTTP seam into a real database.
- **E2E (Playwright)** — log in → create product → receive a purchase → confirm a sale → see stock
  update, driven through the React UI.
