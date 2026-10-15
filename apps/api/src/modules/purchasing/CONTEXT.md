# Purchasing

How goods enter the business. A purchase order is agreed with a supplier and, once received,
raises the stock of the ordered products.

## Language

**Supplier**:
An organization the business buys products from.
_Avoid_: Vendor, Provider, Seller

**PurchaseOrder**:
An order placed with one Supplier to bring one or more products in. Moves through Draft, Placed, Received, Cancelled.
_Avoid_: Purchase, Buy, PO, Procurement

**PurchaseOrderLine**:
A single product and ordered quantity within a PurchaseOrder, at an agreed unit cost.
_Avoid_: Item, Row, Detail

**Receive**:
The act of confirming a placed PurchaseOrder has arrived, which creates inbound StockMovements for its lines.
_Avoid_: Fulfill, Accept, Complete
