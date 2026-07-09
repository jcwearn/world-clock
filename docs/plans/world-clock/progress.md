# Progress: World Clock

## Current Status: In Progress

| Phase | Status | Updated | Notes |
|-------|--------|---------|-------|
| 1. App + packaging | In Progress | 2026-07-09 | App, tests, Docker, CI complete; verifying and opening PR |
| 2. Deployment (k3s-cluster) | Not Started | — | Blocked on PR #1 merge + first image publish (needs image digest) |

## Handoff Notes
- Phase 2 needs the `v0.1.0` image digest from ghcr.io/jcwearn/world-clock after the release workflow runs; pin it in `apps/world-clock/deployment.yaml` in the k3s-cluster repo.
- Release labels (`release:major|minor|patch`) must exist on the GitHub repo; PR #1 should carry `release:minor`.
