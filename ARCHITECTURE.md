# Architecture

## Application shape

Bytewise uses the Next.js App Router with React Server Components by default. Client Components are limited to interactions such as forms, charts, theme controls and the mobile sidebar. Supabase provides PostgreSQL, authentication and Row Level Security. Vercel can deploy the application without a custom server.

```text
Browser
  ├─ public pages and client interactions
  └─ Supabase session cookie
        ↓
Next.js proxy → refreshes and validates sessions
        ↓
Server Components / Route Handlers
        ↓
Supabase PostgreSQL + RLS
```

## Source structure

```text
src/
  app/
    (auth)/             authentication screens
    (platform)/         signed-in application shell
    auth/callback/      secure PKCE callback
  components/
    auth/ content/ dashboard/ marketing/ onboarding/ providers/ ui/
  lib/
    supabase/ validation/ demo-data.ts env.ts utils.ts
  types/
supabase/
  migrations/ seed.sql
e2e/
```

The course model is deliberately data-driven. `lib/content/repository.ts` reads the active enrolment and published hierarchy from Supabase, while the same interfaces serve labelled demo content when credentials are absent. Adding a board or qualification is a database change, not a navigation rewrite. Protected answers live in separate tables with no client read grant. Future marking runs inside trusted server-side functions and returns only post-submission feedback.

## Key decisions

- Supabase publishable credentials may be browser-visible; secret/service-role credentials must remain server-only.
- `getClaims()` in the proxy performs fast session gating; server data reads still rely on verified users and RLS.
- Demo mode makes the front end reviewable before a Supabase project exists, but is visibly labelled and never pretends to persist.
- British English is used throughout the interface.
