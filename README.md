# Flego — Full-Stack (Next.js App Router + TypeScript)

A travel community platform: browse and join trips, host your own, read
community travel stories. Frontend and API both live in one Next.js app;
data is an in-memory mock database structured so a real one (Prisma,
Mongoose, etc.) can be swapped in without touching routes or components.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · `lucide-react` ·
`jsonwebtoken` + `bcryptjs` for auth · in-memory repository layer.

## Getting started


flego-fullstack/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .env.local.example
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/
    │   │   │   ├── login/route.ts       # POST — verify credentials, set cookie
    │   │   │   ├── register/route.ts    # POST — hash + create user, set cookie
    │   │   │   ├── me/route.ts          # GET  — current user (protected)
    │   │   │   └── logout/route.ts      # POST — clears the httpOnly cookie
    │   │   ├── trips/
    │   │   │   ├── route.ts             # GET (search) / POST (protected, create)
    │   │   │   └── [id]/join/route.ts   # POST — protected, decrements spots
    │   │   └── blogs/
    │   │       ├── route.ts             # GET — list stories
    │   │       └── [id]/like/route.ts   # POST — protected, per-user like toggle
    │   ├── layout.tsx                   # fonts, global providers, navbar, modals
    │   ├── page.tsx                     # Hero + TripGrid + BlogSection
    │   ├── loading.tsx                  # route-level Suspense fallback
    │   └── globals.css
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── TripCard.tsx                 # boarding-pass styled trip card
    │   ├── TripGrid.tsx                 # search + grid + empty/loading states
    │   ├── CreateTripModal.tsx          # host-a-trip form modal
    │   ├── AuthModal.tsx                # login/register modal
    │   ├── BlogSection.tsx
    │   └── Skeletons.tsx
    ├── context/
    │   ├── AuthContext.tsx              # session state, login/register/logout
    │   ├── TravelContext.tsx            # trips/blogs state, search, optimistic actions
    │   └── ToastContext.tsx             # toast notifications (see note below)
    ├── lib/
    │   ├── db.ts                        # in-memory store + repositories + seed data
    │   └── auth.ts                      # JWT sign/verify, cookie/header auth helper
    └── types/
        └── index.ts                     # User, Trip, Blog, AuthTokenPayload, etc.
```

**Two additions beyond the requested tree**, both required to fully satisfy
the feature list: `src/context/ToastContext.tsx` (toast notifications) and
`src/app/api/blogs/[id]/like/route.ts` (the like endpoint the spec
describes but the tree omitted). `auth/logout/route.ts` was added too — a
cookie set as `httpOnly` can't be cleared from client JS, so logging out
needs a tiny server route to expire it.

## Authentication

Login/register issue a JWT and set it as an `httpOnly` cookie
(`flego_token`), so the browser attaches it automatically on same-origin
`fetch` calls — no manual header wiring in components. `lib/auth.ts` also
accepts `Authorization: Bearer <token>`, so the same API works for
non-browser clients (mobile app, `curl`, Postman) using the `token` field
returned in the JSON body.

`AuthContext` calls `GET /api/auth/me` on mount to hydrate the session,
and exposes `login`, `register`, `logout`. `TravelContext` reads `useAuth()`
to gate joining trips / liking stories / opening the host modal — if
you're not logged in, those actions open `AuthModal` instead.

## Data layer

`src/lib/db.ts` holds a `globalThis`-backed singleton (so the data survives
Next.js dev-mode hot reloads) plus three repositories — `userRepo`,
`tripRepo`, `blogRepo` — each with `findAll` / `findById` / `create` /
etc. Every method has a `// TODO(DB swap)` comment showing its
Mongoose/Prisma equivalent. Routes and components only ever call repo
methods, so migrating to a real database means rewriting `lib/db.ts`
internals — nothing else changes.

## API reference

All responses are JSON: `{ success, message?, ...data }`. Protected routes
need the `flego_token` cookie (automatic in-browser) or an `Authorization:
Bearer <token>` header.

| Method | Route                    | Auth      | Description                                    |
|--------|---------------------------|-----------|-------------------------------------------------|
| POST   | `/api/auth/register`      | —         | Create account, sets cookie, returns `{token,user}` |
| POST   | `/api/auth/login`         | —         | Verify credentials, sets cookie                 |
| GET    | `/api/auth/me`            | required  | Current logged-in user                          |
| POST   | `/api/auth/logout`        | —         | Clears the auth cookie                          |
| GET    | `/api/trips`              | —         | List trips, `?search=` filters title/destination |
| POST   | `/api/trips`              | required  | Create a trip (host = logged-in user)            |
| POST   | `/api/trips/[id]/join`    | required  | Join a trip — decrements `spotsLeft`             |
| GET    | `/api/blogs`              | —         | List travel stories                              |
| POST   | `/api/blogs/[id]/like`    | required  | Toggle like for the current user                 |

### Example

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"demo@flego.com","password":"password123"}'

curl -X POST http://localhost:3000/api/trips/1/join \
  -b cookies.txt
```

## UX details worth knowing

- **Optimistic updates**: joining a trip and liking a story update local
  state immediately and roll back if the server call fails (see
  `TravelContext.joinTrip` / `toggleLikeBlog`).
- **Skeletons**: `TripGrid` and `BlogSection` render `Skeletons.tsx`
  placeholders while their initial fetch is in flight.
- **Toasts**: any create/join/like success or failure surfaces via
  `useToast()` — bottom-center on mobile, bottom-right on desktop.
- **Responsive nav**: `Navbar` collapses to a slide-down menu under `md`.

## Swapping in a real database

1. Add your ORM/driver and a connection module (e.g. `src/lib/prisma.ts`).
2. Rewrite the method bodies inside `userRepo` / `tripRepo` / `blogRepo` in
   `src/lib/db.ts` — the `// TODO(DB swap)` comments show the intended
   query for each. Keep the method names and return shapes the same.
3. Remove `ensureSeeded()` (or repoint it at a proper seed script).

Nothing in `src/app/api/*`, `src/context/*`, or `src/components/*` needs
to change.
