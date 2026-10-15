# Modular monolith, not microservices

The API is one deployable NestJS application divided into bounded-context modules (inventory,
purchasing, sales, iam) with explicit boundaries, not a set of independently deployed services.
A monolith keeps cross-context invariants (stock must not go negative when a sale is confirmed)
inside a single database transaction, which microservices would force into distributed
sagas. We accept that the modules share a process and a database in exchange for simple,
strongly-consistent business rules.
