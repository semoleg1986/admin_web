# Admin App Architecture (Senior Pattern)

`admin_app` построен по layered/FSD-подходу поверх Nuxt 3.

## Слои

- `src/app`:
  - глобальные стили,
  - приложение/инициализация,
  - конфигурация окружения.
- `src/pages`:
  - route-level страницы,
  - композиция виджетов/фич.
- `src/features`:
  - изолированные бизнес-фичи,
  - структура внутри фичи: `model`, `api`, `ui`.
- `src/shared`:
  - переиспользуемый UI,
  - `lib` утилиты,
  - `api` thin-клиенты,
  - `types` контрактные типы.
- `src/server`:
  - Nitro API handlers.

## Правила зависимостей

- `pages` может импортировать из `shared`.
- `pages` может импортировать из `features`.
- `features` может импортировать из `shared`.
- `features` не импортирует другие `features` напрямую.
- `shared` не импортирует `pages`.
- `server` изолирован от UI-слоя.
- Общие типы DTO выносятся в `shared/types`.

## Папки

- `src/features/*/{model,api,ui}`: вертикальные срезы фич.
- `src/shared/ui/*`: атомарные компоненты.
- `src/shared/lib/*`: чистые функции (без side effects).
- `src/shared/lib/preferences/*`: i18n + theme preferences (`light|dark|system`).
- `src/shared/api/*`: обертки над `useFetch`.
- `tests/unit/*`: юнит-тесты по слоям shared/server.

## Admin navigation

- `Dashboard`: top-level operational overview.
- `Operations`: payments/orders and user administration.
- `Content`: course/catalog administration and Studio hand-off.
- `System`: sidebar settings panel for theme/language/backend status/logout.

Dashboard metrics should be backend-composed read models. Until
`/api/admin/dashboard/summary` exists, the page may show only metrics backed by
existing admin queries and explicit placeholders for missing summary data.

## Staff Invite Flow

- UI entrypoint: `Users`.
- Frontend calls only `/api/admin/users/:userId/staff-invite`.
- Nitro proxy forwards the admin Bearer token to `users_service`
  `/v1/admin/users/:userId/staff-invite`.
- `users_service` owns the invite invariant: target user must already exist,
  be active, and have the requested staff role.
- `studio_app` owns invite acceptance UX at `/invite/accept?token=...`.
- `NUXT_PUBLIC_STUDIO_SITE_URL` is used only to compose the copyable invite
  link shown to the admin.

## Why this

- предсказуемый рост проекта,
- легкий onboarding,
- контроль связности и границ слоя.
