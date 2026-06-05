# Trip Picks

Full-stack travel planning for browsing Lagos activities, saving picks, and creating day plans.

```
apps/api  - Fastify API + Prisma v7 + PostgreSQL
apps/web  - Next.js 16 App Router + Tailwind CSS v4 + TanStack Query
```

## Prerequisites

- Node.js >= 20
- PostgreSQL

## Setup

```sh
npm install
```

### Database

Create the database:

```sh
createdb trip_picks
```

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trip_picks?schema=public"
COOKIE_SECRET="d51793f7ab97190441ca4432926a6f8e71c01f0e9b5a577a3af673c2aadbe8c8"
```

### Migrate & Seed

```sh
npm run prisma:migrate -w @trip-picks/api
npm run seed -w @trip-picks/api
```

Prisma client is auto-generated on `postinstall`. Re-run manually if needed:

```sh
npm run prisma:generate -w @trip-picks/api
```

## Dev

```sh
npm run dev              # all workspaces (API :4000 + Web :3000)
npm run dev -w @trip-picks/api   # API only
npm run dev -w @trip-picks/web   # Web only
```

## API

Swagger UI: `http://localhost:4000/docs`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /activities | List/search activities (`q`, `category`, `area`, `page`, `limit`) |
| GET | /activities/:id | Activity detail |
| POST | /plans | Create plan |
| GET | /plans/:id | Get plan |
| PATCH | /plans/:id | Update plan |

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all workspaces |
| `npm run build` | Build all workspaces |
| `npm run typecheck` | TypeScript check all workspaces |
| `npm run test` | Run tests |

## Demo

After seeding, sign in with:

```
Email:    demo@trip-picks.app
Password: password123
```

## Tradeoffs

- Rate limiting (single-user app)
- No pagination needed at current scale but supported
- Rating stored as `Float` (simpler than Decimal for JS interop)
- Tags as Postgres text array
- No user-creatable activities (read-only catalogue)
