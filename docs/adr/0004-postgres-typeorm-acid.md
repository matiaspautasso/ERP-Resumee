# PostgreSQL + TypeORM, invariants enforced inside ACID transactions

The write model is PostgreSQL accessed through TypeORM. Multi-table commands (receiving a
purchase order, confirming a sales order) run inside an explicit transaction via a TypeORM
QueryRunner, so the order-state change and the stock movements commit or roll back together.
We chose Postgres for strong transactional guarantees and TypeORM for first-class NestJS
integration and migrations, accepting ORM lock-in as the cost of development speed.
