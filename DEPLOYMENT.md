# Vercel deployment

## 1. Prepare Supabase

Create a production Supabase project, apply `supabase/migrations` in filename order, run `supabase/seed.sql`, and verify RLS with separate student, teacher and administrator accounts. Add the production callback URL (`https://YOUR_DOMAIN/auth/callback`) to Supabase Authentication redirects.

## 2. Import into Vercel

Import the GitHub repository into Vercel. The framework preset is Next.js; no custom build configuration is required. Use Node.js 20 and the normal `npm run build` command.

Configure these Production and Preview environment variables:

| Variable | Visibility | Production value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser-safe | production project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser-safe | publishable key |
| `SUPABASE_SECRET_KEY` | server only | production secret key |
| `CLASS_CODE_PEPPER` | server only | long random value, distinct from other secrets |
| `NEXT_PUBLIC_DEMO_MODE` | browser-safe | `false` |
| `NEXT_PUBLIC_SITE_URL` | browser-safe | canonical HTTPS origin |
| `STRIPE_MODE` | server only | `test` until production approval |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | browser-safe | matching Stripe mode key |
| `STRIPE_SECRET_KEY` | server only | matching Stripe mode key |
| `STRIPE_WEBHOOK_SECRET` | server only | secret for this exact endpoint |
| four `STRIPE_*_PRICE_ID` values | server only | approved recurring price IDs |
| two `STRIPE_*_PORTAL_CONFIGURATION_ID` values | server only | separated student/teacher portals |

Never place a secret in a `NEXT_PUBLIC_` variable. Use a separate Supabase project for untrusted preview deployments or leave previews in labelled demo mode.

## 3. Release gate

GitHub Actions runs lint, TypeScript, unit tests, production build and Playwright across Chromium, Firefox, WebKit, mobile and tablet profiles. Require the `Quality` checks before merging to `main`. Vercel then creates the production deployment from the protected branch.

## 4. Production controls

- Add Vercel Firewall rate limits for `/api/classes/join`, submission endpoints, imports, roles and account deletion.
- Set a custom domain, HTTPS, deployment access policy and spend alerts.
- Configure privacy-safe error monitoring, uptime checks and Supabase backups.
- Smoke-test sign-in, deletion, practice submission, exam timing, class access and admin denial after deployment.
- Register the HTTPS Stripe webhook, then test all four paid prices, portal ownership, cancellation and failed renewal in test mode as described in [STRIPE_SETUP.md](STRIPE_SETUP.md).
- Replace legal placeholders and provide monitored accessibility, safeguarding and security contacts.

Rollback by promoting the last known-good Vercel deployment. Database migrations are forward-only; test them in staging and take a backup before schema changes.
