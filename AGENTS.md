# AGENTS.md

A modular-monolith ERP: a NestJS API (`apps/api`), a React client (`apps/web`), and shared
domain values (`packages/shared`), in a pnpm workspace.

## Orientation

- **Domain language** lives in [`CONTEXT-MAP.md`](./CONTEXT-MAP.md) and each context's `CONTEXT.md`. Use those exact terms; the `_Avoid_` lists are binding (no `Sale`, `Vendor`, `inventory count`).
- **Decisions** are in [`docs/adr/`](./docs/adr). Read the relevant ADR before changing architecture.
- **Module shapes, seams, and the test strategy** are in [`docs/DESIGN.md`](./docs/DESIGN.md).

## Commands

Scripts are the source of truth (`package.json` at the root and per package). The non-obvious parts:

- **Integration tests** (`pnpm test:integration`) start a real PostgreSQL via Testcontainers — Docker must be running.
- **E2E** (`pnpm --filter @erp/web test:e2e`) drives the built web app against a running, seeded API. The web proxies `/api` to `VITE_API_URL` (default `http://localhost:3000`).
- **Local stack**: `docker compose up --build` runs db + api; then `pnpm --filter @erp/api seed` loads roles and users.

## How the domain works

- **Money is integer minor units** everywhere (cents). Never a float. Format for display with `Money` from `@erp/shared`.
- **Stock is derived, never stored.** `QuantityOnHand` is the sum of a product's append-only `StockMovement`s; there is no quantity column. Change stock only through `StockLedger`.
- **Cross-context writes are atomic.** Receiving a purchase and confirming a sale compose `StockLedger` calls inside `TransactionRunner.run(...)`; a failure rolls the whole command back.
- **Every state-changing endpoint is guarded** by `@RequirePermissions('resource:action')`. Authorization is evaluated by the pure `AccessPolicy`.
- **Domain errors map to HTTP** through `DomainExceptionFilter`: a rule violation (insufficient stock, non-confirmable order) returns `409`.

## Changing code

Work test-first, and add tests only at the seams `docs/DESIGN.md` names: pure logic (`Money`,
`Quantity`, order rules, `AccessPolicy`) through unit tests; the HTTP + database path through
integration tests against Testcontainers. Do not reach past an interface to test internals.
