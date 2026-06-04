# Trip Picks

Full-stack travel planning for browsing Lagos activities, saving picks, and creating day plans.

```
apps/api  - Fastify API, Prisma v7, Postgres
apps/web  - Next.js frontend
```

## Setup

```sh
npm install
```

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trip_picks?schema=public"
```

Create DB, migrate, generate client, seed:

```sh
createdb trip_picks
npm run prisma:migrate -w @trip-picks/api
npm run prisma:generate -w @trip-picks/api
npm run seed -w @trip-picks/api
```

## Dev

```sh
npm run dev              # all workspaces
npm run dev -w @trip-picks/api   # API on :4000
npm run dev -w @trip-picks/web   # Web on :3000
```

## API

Swagger UI: `http://localhost:4000/docs`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /activities | List/search activities (query: `q`, `category`, `area`, `page`, `limit`) |
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

## Tradeoffs

- No auth (single-user)
- No pagination needed at current scale but supported
- Rating stored as `Float` (simpler than Decimal for JS interop)
- Tags as Postgres text array
- No user-creatable activities (read-only catalogue)
