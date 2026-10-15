# IAM

Identity and access management. Decides who may perform each state-changing command across
every other context.

## Language

**User**:
A person who authenticates and acts in the system. Holds one or more Roles.
_Avoid_: Account, Member, Operator

**Role**:
A named bundle of Permissions granted to Users, such as Admin, WarehouseOperator, or SalesClerk.
_Avoid_: Group, Profile, Level

**Permission**:
The right to perform one action on one resource, written `resource:action` (for example `sales_order:confirm`).
_Avoid_: Scope, Grant, Right, Ability

**Credential**:
The secret a User authenticates with, stored only as an Argon2id hash, never in plain text.
_Avoid_: Password, Secret, Token
