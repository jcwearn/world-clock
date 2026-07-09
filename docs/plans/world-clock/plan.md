# Plan: World Clock — timezone coordination app

## Context
Coordinating a wedding in India requires juggling IST, US Eastern, and US West Coast times. This app shows configurable digital clocks; editing any clock's time pins a hypothetical moment and converts it across all the others. It mirrors the conventions of agent-orchestrator (stack, Docker, CI/release) and deploys to the k3s cluster like the other self-hosted apps.

## Design decisions
- Editing any clock sets a hypothetical instant; all clocks convert and freeze at it; "Back to live" resumes ticking.
- Static frontend only (React + Vite + TS + Tailwind v4 + shadcn/ui) served by unprivileged nginx on port 8080. No backend.
- Clock setup (timezones, labels, order, 12/24h) is managed in-app and persisted to localStorage under `world-clock:v1`. Default: one clock in the visitor's own timezone.
- Timezone picker: searchable list from `Intl.supportedValuesOf('timeZone')`; timezone math via luxon.
- Image: `ghcr.io/jcwearn/world-clock`, label-driven semver releases (`release:major|minor|patch` PR labels).

## Phases

### Phase 1: App + packaging (this repo)
- Vite/React scaffold, shadcn/ui components, clock UI, settings store, unit tests (vitest)
- Dockerfile (node build → nginx-unprivileged), nginx.conf, Makefile, GitHub workflows, renovate.json
- Files: `src/lib/{time,settings,timezones}.ts`, `src/components/{ClockCard,AddClockDialog,PinnedBanner}.tsx`, `src/App.tsx`
- Acceptance: tests/lint/build green, docker image serves the app, PR opened with a release label

### Phase 2: Deployment (k3s-cluster repo)
- `apps/world-clock/`: namespace, deployment (pinned image + digest), ClusterIP service, HTTPRoute `clock.wearn.dev`, kustomization
- Modeled on `apps/it-tools/`; Flux auto-discovers, DNS/TLS automatic
- Acceptance: `kustomize build apps/world-clock` renders; app reachable at https://clock.wearn.dev after merge
