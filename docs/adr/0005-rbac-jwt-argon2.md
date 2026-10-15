# RBAC with resource:action permissions, JWT access tokens, Argon2id hashing

Authorization is role-based: Users hold Roles, Roles bundle Permissions written as
`resource:action`, and every state-changing endpoint is guarded by a required permission.
Authentication issues stateless JWT access tokens; passwords are stored only as Argon2id
hashes. We picked permission-level granularity (not role checks in handlers) so access rules
live in metadata and are testable in isolation, and Argon2id over bcrypt for its memory-hard
resistance to GPU attacks.
