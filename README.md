# world-clock

A small self-hosted world clock for coordinating across timezones. Shows configurable digital clocks (shadcn/ui cards); editing any clock's time pins a hypothetical moment and converts it across all the others — handy for questions like "if it's 7pm Eastern, what time is it in India?".

- Static frontend: React + Vite + TypeScript + Tailwind v4 + shadcn/ui
- Clock setup (timezones, labels, order, 12/24h) is managed in-app and persisted to localStorage
- One build (`dist/`), two deploy targets: a container image (`ghcr.io/jcwearn/world-clock`) served by unprivileged nginx, and Cloudflare Pages

## Development

```sh
npm install
npm run dev
```

## Build & run in Docker

```sh
make docker-build
docker run -p 8080:8080 world-clock
```

## Deploy

`npm run build` produces a static `dist/` that both targets serve as-is — there is no
backend, no env vars, and no per-target build.

### Container (k3s)

`release.yml` publishes `ghcr.io/jcwearn/world-clock` on merge to `main`. Kubernetes
manifests live in the `k3s-cluster` repo under `apps/world-clock/`.

### Cloudflare Pages

Deployed via Cloudflare's Git integration — pushes to `main` publish to production,
pull requests get preview deployments. Project settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` (also set in `wrangler.jsonc`) |
| Root directory | `/` |
| Node version | from `.nvmrc` |

`public/_headers` is copied into `dist/` by Vite and sets the same caching and security
headers `nginx.conf` sets, so both targets behave the same. Pages consumes it as config;
nginx serves it as an inert text file. No `_redirects` file is needed — Pages already
serves `index.html` for unmatched paths, matching `try_files ... /index.html` in nginx.

Preview the real edge runtime locally (`npm run preview` uses Vite and ignores
`_headers`):

```sh
make cf-preview   # wrangler pages dev
```

`make cf-deploy` uploads a build directly, as an escape hatch when the Git integration
is unavailable.
