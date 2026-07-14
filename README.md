# Bytewise

Bytewise is an original Computer Science revision platform for UK GCSE and A-level students. This repository currently contains **Phase 1: Foundation**: the design system, Supabase-ready authentication, onboarding, role-aware application shell, initial student dashboard, normalised database schema, and Row Level Security strategy.

The dashboard uses friendly demo data when Supabase is not configured. Once connected, authentication, profiles and course enrolment use the database. Later learning and practice features are deliberately labelled “Soon” rather than presented as working controls.

## Local setup

Requirements: Node.js 20.9 or newer, npm, and optionally the Supabase CLI.

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/AnnikaMattioli/CS-Revision-App.git
   cd CS-Revision-App
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the environment file:

   ```bash
   cp .env.example .env.local
   ```

4. For the visual demo, leave `NEXT_PUBLIC_DEMO_MODE=true`. For real accounts, create a free Supabase project, place its Project URL and **publishable** key in `.env.local`, and set demo mode to `false`. Never use a secret or service-role key in a `NEXT_PUBLIC_` variable.

5. In Supabase SQL Editor, apply [`supabase/migrations/202607130001_initial_schema.sql`](supabase/migrations/202607130001_initial_schema.sql), followed by [`supabase/seed.sql`](supabase/seed.sql). With the CLI, use `supabase link`, then `supabase db push` and `supabase db seed`.

6. In Supabase Authentication URL settings, add `http://localhost:3000/auth/callback` as an allowed redirect URL.

7. Run the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium  # once, before browser tests
npm run test:e2e
```

## Current limitations

- The seed contains the four requested course shells only; it does not claim full specification coverage.
- Dashboard learning statistics remain demonstration values until progress tables are populated in Phases 2–4.
- Email delivery and password reset depend on Supabase project configuration.
- Teacher and administrator database boundaries exist, but their interfaces arrive in Phases 6 and 7.
- Rate limiting for sensitive production endpoints should be added at the deployment edge in Phase 8.

See [ROADMAP.md](ROADMAP.md) for the section-by-section plan.
