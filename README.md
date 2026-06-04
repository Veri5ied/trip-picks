# Trip Picks

Full-stack travel planning for browsing Lagos activities, saving picks, and creating day plans.

```
apps/api  - Fastify API + Prisma v7 + PostgreSQL
apps/web  - Next.js 16 App Router + Tailwind CSS v4 + TanStack Query
```

## Prerequisites

- Node.js >= 20
- PostgreSQL (local or [NeonDB](https://neon.tech))

## Setup

```sh
npm install
```

### Database (local)

```sh
createdb trip_picks
```

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trip_picks?schema=public"
```

### Database (NeonDB)

Create a free project at [neon.tech](https://neon.tech), copy the connection string.

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.cloud/neondb?sslmode=require"
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

## Deploy

### Render (API)

1. New Web Service → connect repo
2. Root directory: `/`
3. Build: `npm install && cd apps/api && npx prisma generate && npm run build && npx prisma migrate deploy`
4. Start: `node apps/api/dist/src/server.js`
5. Env vars:

```
DATABASE_URL=<neondb-connection-string>
WEB_ORIGIN=https://<vercel-app>.vercel.app
```

### Vercel (Web)

1. New project → connect repo
2. Root directory: `apps/web`
3. Framework: Next.js
4. Env var:

```
NEXT_PUBLIC_API_URL=https://<render-app>.onrender.com
```

## Tradeoffs

- No auth (single-user)
- No pagination needed at current scale but supported
- Rating stored as `Float` (simpler than Decimal for JS interop)
- Tags as Postgres text array
- No user-creatable activities (read-only catalogue)
