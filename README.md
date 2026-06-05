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

## What I'd improve next

**Backend**
- Persist activity reorder via `position` on plan detail endpoint
- `DELETE /favorites/:id` (only supports removal by activityId)
- Rate limiting + validation error formatting
- Seed 15-20 activities with more varied areas, categories, price levels

**UI**
- Drag-to-reorder in plan timeline (`@dnd-kit`)
- Leaflet map on plan detail with pinned activity locations
- Removable filter chips below search bar
- Show all tags in activity modal (first 3 hidden)
- Disable create-plan button when 0 activities selected (backend already blocks)
- Stagger-fade-in timeline stops on page load

**UX**
- Native bottom sheets on mobile for modals
- PWA manifest + service worker for installable mobile app
- Swipe gestures: left to delete plan, right to mark done (sounds good hehehehe)

**Structure**
- **pnpm workspaces** for content-addressable disk storage + strict dependency isolation
- **`packages/shared`** for shared types (Activity, Plan, User, Zod schemas) to eliminate API/Web duplication
- **Turborepo** for cached builds and typechecking
- **Docker Compose** with PostgreSQL + API so new contributors run one command
- Root-level **ESLint + Prettier** config

## Tradeoffs

- Rate limiting (single-user app)
- No pagination needed at current scale but currently supported
- Rating stored as `Float` (simpler than Decimal for JS interop)
- Tags as Postgres text array
- No user-creatable activities (read-only catalogue)
