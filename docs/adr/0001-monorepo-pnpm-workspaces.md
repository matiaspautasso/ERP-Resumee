# Monorepo with pnpm workspaces

We keep the API, the web client, and shared types in one repository using pnpm workspaces
(`apps/api`, `apps/web`, `packages/shared`), rather than separate repos or a heavier tool
like Nx/Turborepo. This lets the API and client share a single source of truth for domain
types and contracts and run under one CI pipeline, at the cost of a slightly larger repo and
careful workspace boundaries. pnpm over Nx/Turborepo because the task graph here is small and
does not justify the extra tooling.
