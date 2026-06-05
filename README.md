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
- Add `position` field sorting to plan detail endpoint so reordered activities persist
- Add `DELETE /favorites/:id` (currently only supports removing by activityId)
- Add rate limiting and request validation error formatting
- Seed more activities (15-20) with varied areas, categories, and price levels

**Frontend**
- Drag-to-reorder activities in the plan detail timeline using `@dnd-kit`
- Embed a map (Leaflet) on the plan detail page showing pinned activity locations
- Filter chips in the search bar: show active filters as removable chips below the search input
- Activity modal: display all tags (first 3 are currently hidden)
- Plan creation: disable the submit button visually when 0 activities selected (backend already blocks it)
- Stagger-fade-in animation on the timeline stops when the plan detail page loads

**UX**
- Native-feeling bottom sheets on mobile for modals (auth, activity detail, filters)
- Swipe gestures: swipe left on a plan card to delete, swipe right to mark as done (maybe I am overthinking it but should have a good ux imo)

## Tradeoffs

- Rate limiting (single-user app)
- No pagination needed at current scale but currently supported
- Rating stored as `Float` (simpler than Decimal for JS interop)
- Tags as Postgres text array
- No user-creatable activities (read-only catalogue)
