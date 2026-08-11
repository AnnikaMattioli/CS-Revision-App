# Stripe Billing setup

Bytewise uses Stripe-hosted Checkout and Customer Portal, verified webhooks, and trusted subscription records in Supabase. Keep the system in Stripe test mode until every item in the production checklist has been completed deliberately.

## 1. Prerequisites

- An authorised Stripe account with a test-mode sandbox.
- A Supabase project with every migration in `supabase/migrations` applied.
- Node.js 20.9+, npm and Stripe CLI for local webhook forwarding.
- Student and teacher test accounts. Never self-assign the administrator role.

## 2. Products, prices and internal plans

Run the idempotent test provisioning script after adding a Stripe test secret to `.env.local`:

```bash
npm run stripe:provision:test
```

It creates or reuses two GBP products and four recurring prices. Copy the returned references into `.env.local`; never commit real values.

| Internal plan | Stripe product | Interval | Display price |
|---|---|---:|---:|
| `student_plus_monthly` | Student Plus | monthly | £5.99 |
| `student_plus_annual` | Student Plus | yearly | £49.00 |
| `teacher_pro_monthly` | Teacher Pro | monthly | £24.99 |
| `teacher_pro_annual` | Teacher Pro | yearly | £199.00 |

Stripe validates the amount and currency before Checkout is created. Browsers send only an approved internal plan identifier; arbitrary price IDs are rejected.

## 3. Environment variables

Use `.env.example` as the source list. Local development uses `.env.local`; Vercel uses encrypted project environment variables.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_MODE=test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STUDENT_PLUS_MONTHLY_PRICE_ID=price_...
STRIPE_STUDENT_PLUS_ANNUAL_PRICE_ID=price_...
STRIPE_TEACHER_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_TEACHER_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_STUDENT_PORTAL_CONFIGURATION_ID=bpc_...
STRIPE_TEACHER_PORTAL_CONFIGURATION_ID=bpc_...
```

Obtain API keys from Stripe Dashboard → Developers → API keys while test mode is active. Secret and webhook keys must never use a `NEXT_PUBLIC_` prefix. Rotate any key that appears in source control, screenshots, logs or chat, then update every environment that used it.

## 4. Customer Portal

Create separate student and teacher portal configurations. Both may update payment methods, billing details, invoices and cancellation. Limit plan switching to prices within the same product family: Student Plus monthly/annual in the student portal and Teacher Pro monthly/annual in the teacher portal. This prevents a portal change from crossing account roles.

Monthly-to-annual changes may use Stripe proration when configured. Configure annual-to-monthly changes for the end of the paid period. Confirm the effective date, credit and next invoice in the hosted portal before accepting the change.

## 5. Local webhooks

Authenticate Stripe CLI, then run:

```bash
npm run stripe:webhook:listen
```

Save the displayed `whsec_...` value as `STRIPE_WEBHOOK_SECRET`, restart the app, and keep the listener running during local checkout tests. The endpoint is `/api/stripe/webhook` and handles:

- checkout completion;
- subscription creation, update and deletion;
- paid, failed and action-required invoices;
- trial-ending notifications;
- customer updates;
- disputes and refunds as safely logged events where no access mutation is required.

The raw request body is signature-verified. Stripe event IDs are unique, duplicate delivery is idempotent, failed processing can be reclaimed, and critical changes retrieve the latest Stripe subscription before updating Supabase.

## 6. Access and fair use

The application never checks Stripe product names inside learning features. `src/lib/billing` resolves the user’s account family, active internal plans, complimentary grants, administrator override, typed entitlements and limits.

- Student Free keeps core lessons, revision, standard practice, basic progress and three custom tests monthly.
- Student Plus adds premium student entitlements, unlimited custom tests and 20 generated papers monthly.
- Teacher Free allows one active class, 15 active students and three active assignments.
- Teacher Pro adds higher resource ceilings, advanced analytics and timed class tests.
- AI-backed features remain unavailable with a graceful explanation until a provider is configured. No unlimited third-party AI usage is promised.

Usage periods reset at 00:00 UTC on the first day of each calendar month. Supabase records consumption atomically so concurrent requests cannot bypass a limit. Complimentary access combines with—rather than overwrites—a Stripe subscription and expires automatically.

## 7. Test-mode walkthrough

For each paid plan, sign in with the matching account role, open `/pricing`, choose the plan, complete hosted Checkout with a Stripe test card, and wait for `/billing/success` to confirm trusted activation. Verify `/billing`, the relevant premium feature and Customer Portal.

Recommended Stripe test cases:

| Scenario | Method | Expected result |
|---|---|---|
| Successful payment | `4242 4242 4242 4242` | Webhook activates the matching plan |
| Authentication required | Stripe’s 3DS test card | Hosted authentication completes before activation |
| Declined payment | Stripe’s generic decline test card | No access; Checkout explains the decline |
| Cancelled Checkout | Use Stripe’s back control | Cancellation page; free access unchanged |
| Cancellation at period end | Customer Portal | Access remains until the recorded period end |
| Failed renewal | Stripe test clock or test subscription | Billing warning appears; configured grace policy applies |
| Renewal | Stripe test clock | Period dates advance after verified invoice/subscription events |
| Monthly to annual | Matching family in portal | Only the equivalent student or teacher annual price is available |
| Duplicate event | `stripe events resend EVENT_ID` twice | One internal event is processed |
| Out-of-order event | Resend older event after a newer update | Latest Stripe subscription state wins |
| Complimentary expiry | Expiring admin grant | Paid entitlement disappears after expiry; Stripe record remains |
| Teacher Free ceiling | Create beyond 1/15/3 | Creation is blocked; existing data remains |
| Family separation | Attempt wrong role’s plan/API request | Server returns a role-plan rejection |

Use Stripe Dashboard test clocks for renewal and lifecycle testing. Do not call live Stripe services from automated tests.

## 8. Refunds and deletion

Refunds are manual and administrator-controlled in Stripe Dashboard. Confirm the customer, charge, amount and reason; record the support action without card data; then verify subscription access separately. There is no broad user-facing automatic-refund endpoint.

Paying users cannot delete their Bytewise account while an active or recoverable subscription remains. They must manage or cancel it through the hosted portal first, preventing an inaccessible account from retaining an unknown recurring charge.

## 9. Vercel deployment

1. Apply migrations to a staging Supabase project and test role/RLS separation.
2. Import the GitHub repository into Vercel and set Node.js 20.
3. Add Supabase variables plus the Stripe variables above to Preview or Production as appropriate.
4. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS origin and `NEXT_PUBLIC_DEMO_MODE=false`.
5. Register `https://YOUR_DOMAIN/api/stripe/webhook` in Stripe test mode with the handled event list above; save its signing secret in Vercel.
6. Add the exact authentication callback URL in Supabase.
7. Deploy, execute all four test purchases and smoke-test cancellation, failed payment, portal ownership and account deletion.

## 10. Switching to live mode

Do not reuse test products, prices, portal configuration IDs, API keys or webhook secrets. Recreate the two product families and four GBP recurring prices in live mode, configure separate live portals and register the live HTTPS webhook. Replace every Vercel Stripe value together, set `STRIPE_MODE=live`, redeploy, and confirm that no `sk_test_`, `pk_test_`, test price or test webhook value exists in Production.

The authorised Stripe account holder must complete Stripe’s identity, business, bank and tax requirements. Bytewise must also publish final refund/cancellation terms, privacy information and a monitored support contact before accepting live payment.

## Production checklist

- [ ] All four test purchases succeed and website prices match Stripe.
- [ ] Signatures, duplicates, out-of-order events, renewals and failed renewals are tested.
- [ ] Student and teacher portal configurations cannot cross plan families.
- [ ] Cancellation, grace-period access and account deletion are tested.
- [ ] RLS and server entitlement checks are reviewed with separate roles.
- [ ] Teacher Free limits and atomic student usage limits are verified.
- [ ] Complimentary grant creation, revocation and expiry are verified.
- [ ] Refund/cancellation wording, privacy, terms and support details are final.
- [ ] Vercel HTTPS, firewall limits, monitoring, backups and spend alerts are enabled.
- [ ] Live products, prices, portals and webhook are configured deliberately.
- [ ] Production contains live credentials only; repository history contains no secrets.
- [ ] Stripe account verification is complete.

Until every box is complete, the payment system is test-ready—not production-ready.

## Troubleshooting

- **Checkout says configuration is missing:** verify the selected family’s price ID and restart the server.
- **Success page keeps waiting:** ensure Stripe CLI or the deployed webhook is active and its signing secret matches that endpoint.
- **Portal is unavailable:** confirm the user has a stored Stripe customer and the correct family portal configuration.
- **Wrong plan rejected:** confirm the signed-in account role; student and teacher subscriptions are intentionally separate.
- **Usage does not reset:** inspect the UTC `period_start`/`period_end` in `usage_records` and confirm the Phase 10 migration is applied.
- **Webhook returns 400:** do not parse or alter the body before signature verification; rotate and replace a mismatched signing secret.
