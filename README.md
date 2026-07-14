# Bytewise

Bytewise is an original Computer Science revision platform for UK GCSE and A-level students. The repository now contains **Phases 1–5**: foundation, course content, secure practice, explainable adaptation, and timed Exam Mode. Students can learn, revise, complete autosaved marked sets, understand mastery, follow recommendations, build streaks, unlock achievements and sit configurable timed tests.

The app uses clearly labelled representative data when Supabase is not configured. Once connected, authentication, content, progress and practice attempts use the database. Exam, teacher and administrator features remain labelled “Soon” rather than presented as working controls.

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

4. For the visual demo, leave `NEXT_PUBLIC_DEMO_MODE=true`. For real accounts, create a free Supabase project, place its Project URL, **publishable** key and server-only secret key in `.env.local`, and set demo mode to `false`. `SUPABASE_SECRET_KEY` is used only by trusted marking routes. Never put a secret or service-role key in a `NEXT_PUBLIC_` variable.

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
- The representative practice bank contains ten original questions across three topics; it is an engine demonstration, not full specification coverage.
- Adaptive ranking is fully implemented, but its variety is naturally limited until the representative ten-question bank expands.
- Exam Mode uses the same ten-question representative bank; it demonstrates the complete secure workflow rather than claiming full mock-paper coverage.
- Written marking is deterministic and explainable, but production rubrics still require subject-expert review and moderation.
- Teacher and administrator interfaces arrive in Phases 6 and 7.
- Rate limiting for sensitive production endpoints should be added at the deployment edge in Phase 8.

See [ROADMAP.md](ROADMAP.md) for the section-by-section plan.
