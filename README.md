# world-clock

A small self-hosted world clock for coordinating across timezones. Shows configurable digital clocks (shadcn/ui cards); editing any clock's time pins a hypothetical moment and converts it across all the others — handy for questions like "if it's 7pm Eastern, what time is it in India?".

- Static frontend: React + Vite + TypeScript + Tailwind v4 + shadcn/ui
- Clock setup (timezones, labels, order, 12/24h) is managed in-app and persisted to localStorage
- Ships as a container image (`ghcr.io/jcwearn/world-clock`) served by unprivileged nginx

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
