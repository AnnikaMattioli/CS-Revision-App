# Bytewise

Bytewise is an original Computer Science revision platform for UK GCSE and A-level students. The repository contains the **complete eight-phase application**: foundation, course content, secure practice, explainable adaptation, timed Exam Mode, teacher tools, administrator tools, and release quality/deployment.

Students can learn, revise, use spaced-repetition flashcards, complete autosaved marked sets, understand mastery, follow recommendations, build streaks, unlock achievements, sit configurable timed tests and join classes. Teachers can manage classes, assignments and privacy-minimised learning evidence. Administrators can manage content, protected questions, validated imports, reports and roles through audited workflows.

The app uses clearly labelled representative data when Supabase is not configured. Once connected, authentication, learning workflows, teacher tools and audited administrator workflows use the database.

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

4. For the visual demo, leave `NEXT_PUBLIC_DEMO_MODE=true`. For real accounts, create a free Supabase project, place its Project URL, **publishable** key and server-only secret key in `.env.local`, set a long random `CLASS_CODE_PEPPER`, and set demo mode to `false`. Server secrets are used only by trusted routes. Never put them in a `NEXT_PUBLIC_` variable.

5. In Supabase SQL Editor, apply every file in [`supabase/migrations`](supabase/migrations) in filename order, followed by [`supabase/seed.sql`](supabase/seed.sql). With the CLI, use `supabase link`, then `supabase db push` and `supabase db seed`.

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

`npm run check` runs lint, TypeScript, unit tests and a production build. GitHub Actions adds the complete Playwright matrix across Chromium, Firefox, WebKit, mobile and tablet profiles.

## Production deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the Supabase and Vercel release procedure, environment variables, release gate, production controls and rollback guidance. Do not accept real student accounts until the privacy/terms placeholders have been replaced and the deployment security checklist is complete.

## Technical guides

- [ARCHITECTURE.md](ARCHITECTURE.md) — application boundaries and trusted workflows
- [DATABASE.md](DATABASE.md) — schema and Row Level Security model
- [CONTENT_GUIDE.md](CONTENT_GUIDE.md) — original content and imports
- [MARKING_SYSTEM.md](MARKING_SYSTEM.md) — deterministic, explainable marking
- [ADAPTIVE_ALGORITHM.md](ADAPTIVE_ALGORITHM.md) — mastery and selection
- [EXAM_MODE.md](EXAM_MODE.md) — timed assessment security
- [SECURITY.md](SECURITY.md) — security/privacy review and release checklist
- [ACCESSIBILITY.md](ACCESSIBILITY.md) — WCAG target, coverage and manual checks
- [ROADMAP.md](ROADMAP.md) — completed phase history

## Current limitations

- The four course shells exist, but the representative lesson set currently covers three original OCR GCSE topics only; it does not claim full specification coverage.
- Email delivery and password reset depend on Supabase project configuration.
- The representative practice bank contains ten original questions across three topics; it is an engine demonstration, not full specification coverage.
- Adaptive ranking is fully implemented, but its variety is naturally limited until the representative ten-question bank expands.
- Exam Mode uses the same ten-question representative bank; it demonstrates the complete secure workflow rather than claiming full mock-paper coverage.
- Written marking is deterministic and explainable, but production rubrics still require subject-expert review and moderation.
- Administrative imports are limited to 1 MB and 250 questions per transaction; expand these limits only after deployment load testing.
- The included application rate limiter is per server instance. Production deployments should additionally configure distributed edge limits as described in [SECURITY.md](SECURITY.md).
- Real production terms, privacy ownership/contact details and safeguarding processes are deployment-owner responsibilities; repository pages are clearly labelled where replacement is required.

See [ROADMAP.md](ROADMAP.md) for the section-by-section plan.
