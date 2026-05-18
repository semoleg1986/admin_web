# admin_app

Admin operations console built on Nuxt 3.

## Responsibility

`admin_app` owns:
- admin-facing operational UI
- payment intent review and approval UX
- user and catalog administration surfaces
- server-side backend proxies under `/api`

## Local run

```bash
npm install
npm run dev
```

App URL:
- [http://localhost:3001](http://localhost:3001)

## Environment

- [admin_app/.env.example](/Users/olegsemenov/Programming/curs/admin_app/.env.example)
- [admin_app/.env.local.example](/Users/olegsemenov/Programming/curs/admin_app/.env.local.example)

Key variables:
- `NUXT_AUTH_SERVICE_BASE_URL`
- `NUXT_PUBLIC_API_BASE_URL`
- `NUXT_PUBLIC_SITE_URL`

## UI notes

- left sidebar shell with collapse-to-icons behavior on desktop/tablet
- mobile drawer navigation
- settings panel inside sidebar with theme, language, backend status, and logout

## Tests and quality

```bash
npm test
npm run lint
npm run format:check
```

## Build

```bash
npm run build
npm run start
```

## Documentation

- [docs/ARCHITECTURE.md](/Users/olegsemenov/Programming/curs/admin_app/docs/ARCHITECTURE.md)
