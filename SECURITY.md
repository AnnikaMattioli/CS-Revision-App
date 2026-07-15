# Security and privacy review

## Release controls

- Supabase Authentication owns passwords and sessions; the app never stores passwords.
- Row Level Security isolates student records, class membership and unpublished content. Protected answer rules have no browser grant.
- Teacher and administrator routes verify roles on the server. Administrator changes are audited and self-demotion is blocked.
- Zod validates mutation payloads. Imports are size-limited, previewed, validated and committed in one database transaction.
- Practice and exam marking is trusted server work; correct answers are returned only after an authorised submission.
- Sensitive account, class-code, practice, exam, import and role endpoints use fixed-window application rate limits and return `429` with retry information.
- Responses disable framing, MIME sniffing, unnecessary browser capabilities and caching of API data.
- Account deletion re-verifies the session and deletes the Supabase Auth user, cascading personal records through database foreign keys.

## Deployment checklist

1. Keep `SUPABASE_SECRET_KEY` and `CLASS_CODE_PEPPER` server-only and rotate them if exposed.
2. Set `NEXT_PUBLIC_DEMO_MODE=false`; configure exact Supabase redirect URLs and disable unneeded auth providers.
3. Apply every migration and review RLS with student, teacher and administrator test accounts.
4. Add deployment-edge distributed rate limiting for multi-instance abuse protection. The included in-memory limiter is defence in depth, not a replacement for Vercel Firewall or an equivalent shared store.
5. Configure dependency and secret scanning, monitored error reporting without answer payloads, database backups and an incident contact.
6. Replace the terms/privacy placeholders with organisation-specific, legally reviewed information before collecting real student data.

Report vulnerabilities privately to the deployment owner rather than opening a public issue containing exploit details or student data.
