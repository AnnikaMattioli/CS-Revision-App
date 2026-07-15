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
    api/                trusted practice, exam, class, admin and account mutations
  components/
    admin/ auth/ content/ dashboard/ exam/ marketing/ onboarding/ practice/ progress/ settings/ teacher/ ui/
  lib/
    content/ practice/ supabase/ validation/ demo-data.ts env.ts utils.ts
  types/
supabase/
  migrations/ seed.sql
e2e/
```

The course model is deliberately data-driven. `lib/content/repository.ts` reads the active enrolment and published hierarchy from Supabase, while the same interfaces serve labelled demo content when credentials are absent. Adding a board or qualification is a database change, not a navigation rewrite.

Practice prompts are safe public data. Answer rules, rubrics and explanations are separate protected data and are also represented by a server-only question bank for demo mode. The browser autosaves draft responses, while the submission route validates ownership and set membership, marks on the server, stores trusted results and only then returns formal feedback. See [MARKING_SYSTEM.md](MARKING_SYSTEM.md).

Sensitive mutations pass through application-level fixed-window rate limits. Security headers prevent framing, MIME confusion and unnecessary browser capabilities. A configured account deletion request re-verifies the Supabase session before the trusted Auth deletion cascades through personal records. See [SECURITY.md](SECURITY.md).

After trusted marking, the same server route updates bounded topic mastery, daily activity and achievement awards. Progress pages read only the signed-in student’s RLS-protected records. Adaptive set creation ranks safe question metadata using configurable, documented weights; it never reads protected answers. See [ADAPTIVE_ALGORITHM.md](ADAPTIVE_ALGORITHM.md).

Exam Mode stores authoritative paper rules and deadlines alongside the practice-set model, adds per-question timing, and wraps trusted marking with release-policy enforcement. Delayed feedback is censored by the route and independently protected by RLS. See [EXAM_MODE.md](EXAM_MODE.md).

## Key decisions

- Supabase publishable credentials may be browser-visible; secret/service-role credentials must remain server-only.
- `getClaims()` in the proxy performs fast session gating; server data reads still rely on verified users and RLS.
- Demo mode makes the front end reviewable before a Supabase project exists, but is visibly labelled and never pretends to persist.
- British English is used throughout the interface.
- Private route responses and APIs are not cached; public catalogue data may be cached only where it cannot reveal user state.
- GitHub Actions is the release gate and Vercel is the documented deployment target. See [DEPLOYMENT.md](DEPLOYMENT.md).
