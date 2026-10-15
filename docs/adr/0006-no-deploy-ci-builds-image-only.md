# No deployment target; CI validates and builds images but does not deploy

This is a portfolio project, not a hosted product. CI (GitHub Actions) runs lint, unit,
integration (Testcontainers), and E2E (Playwright) checks and builds the Docker images to prove
they build, but there is no deploy job and no cloud target. Docker Compose exists only to run the
stack locally. A reader should not look for Railway/cloud configuration: its absence is deliberate.
