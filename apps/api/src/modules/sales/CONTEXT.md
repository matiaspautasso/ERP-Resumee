# Sales

How goods leave the business. A sales order is agreed with a customer and, once confirmed,
lowers the stock of the ordered products and can never drive it negative.

## Language

**Customer**:
A person or organization the business sells products to.
_Avoid_: Client, Buyer, Account

**SalesOrder**:
An order placed by one Customer to take one or more products out. Moves through Draft, Confirmed, Cancelled.
_Avoid_: Sale, Invoice, Deal, Order

**SalesOrderLine**:
A single product and requested quantity within a SalesOrder, at an agreed unit price.
_Avoid_: Item, Row, Detail

**Confirm**:
The act of committing a draft SalesOrder, which creates outbound StockMovements for its lines and is rejected if any line would drive QuantityOnHand negative.
_Avoid_: Place, Submit, Checkout
