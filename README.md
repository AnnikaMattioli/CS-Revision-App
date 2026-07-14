# Bytewise

Bytewise is an original Computer Science revision platform for UK GCSE and A-level students. The repository now contains **Phase 1: Foundation** and **Phase 2: Course content**: the design system, Supabase authentication, onboarding, application shell, dashboard, normalised schema, RLS, course hierarchy, topic and lesson pages, saved lesson progress, flashcard reviews and worked solutions.

The app uses clearly labelled representative data when Supabase is not configured. Once connected, authentication, profiles, course enrolment, published content, lesson completion and flashcard reviews use the database. Later practice and exam features are labelled “Soon” rather than presented as working controls.

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

5. In Supabase SQL Editor, apply both files in [`supabase/migrations`](supabase/migrations) in filename order, followed by [`supabase/seed.sql`](supabase/seed.sql). With the CLI, use `supabase link`, then `supabase db push` and `supabase db seed`.

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

- The four course shells exist, but the representative lesson set currently covers three original OCR GCSE topics only; it does not claim full specification coverage.
- Dashboard aggregate statistics remain demonstration values until the mastery and progress calculations arrive in Phase 4.
- Email delivery and password reset depend on Supabase project configuration.
- Practice questions and marking arrive in Phase 3; teacher and administrator interfaces arrive in Phases 6 and 7.
- Rate limiting for sensitive production endpoints should be added at the deployment edge in Phase 8.

See [ROADMAP.md](ROADMAP.md) for the section-by-section plan.
