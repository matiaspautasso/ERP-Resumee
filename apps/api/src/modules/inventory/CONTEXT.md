# Inventory

The source of truth for what the business sells and how much of it exists. Stock only ever
changes by appending movements; it is never overwritten in place.

## Language

**Product**:
A thing that can be stocked and traded, identified by a unique code.
_Avoid_: Item, SKU, Article, Good

**StockMovement**:
An immutable, append-only ledger entry recording a signed change in quantity of one Product (inbound positive, outbound negative), with a reason linking it to its origin.
_Avoid_: Adjustment, Transaction, Entry

**QuantityOnHand**:
The current stock of a Product, computed as the sum of its StockMovements. Never stored as a mutable column.
_Avoid_: Inventory count, Balance, Level

**MovementReason**:
Why a StockMovement exists: a purchase receipt, a sales confirmation, or a manual correction.
_Avoid_: Type, Kind, Category
