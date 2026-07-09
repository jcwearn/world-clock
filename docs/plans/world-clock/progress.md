# Progress: World Clock

## Current Status: In Progress

| Phase | Status | Updated | Notes |
|-------|--------|---------|-------|
| 1. App + packaging | Complete | 2026-07-09 | PR #1 open with release:minor; tests/lint/build/docker smoke all green |
| 2. Deployment (k3s-cluster) | Complete | 2026-07-09 | k3s-cluster PR #659 open (manifests, CoreDNS rewrite, mkdocs page) |

## Handoff Notes
- Merge order: world-clock PR #1 first (its merge publishes the v0.1.0 image via the release workflow), then k3s-cluster PR #659. Renovate pins the image digest on its next run.
- Release labels (`release:major|minor|patch`) exist on the repo; PR #1 carries `release:minor`.
