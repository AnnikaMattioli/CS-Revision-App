# Section-by-section roadmap

## Phase 1 — Foundation (completed)

Next.js setup, original design system, Supabase boundary, full schema migration, RLS, authentication, roles, onboarding, navigation, demo-aware dashboard, documentation and baseline tests.

## Phase 2 — Course content (completed)

Course hierarchy, real topic and lesson pages, persisted lesson progress, active-recall flashcards and worked solutions using representative original content. The initial content is deliberately limited to three OCR GCSE sample topics.

## Phase 3 — Practice engine (completed)

Question renderers, set creation, autosave, protected submission, objective/rubric marking, results and attempt history.

## Phase 4 — Progress and adaptation (completed)

Mastery calculation, progress charts, adaptive selection, weak-area recommendations, achievements and streaks.

## Phase 5 — Exam mode (completed)

Timed assessments, question palette, warnings, auto-submission, results and time analysis.

## Phase 6 — Teacher tools (completed)

Teacher dashboard, classes, one-time secure joining codes, assignment creation and completion, class membership controls, individual learning evidence and privacy-minimising aggregate analytics.

## Phase 7 — Administrator tools (completed)

Audited content management, protected question editing, validated CSV/JSON preview and transactional imports, reports, anonymised performance, server-enforced role management and read-only audit history.

## Phase 8 — Quality and deployment (completed)

Security/privacy headers and rate limits, verified account deletion, accessibility and responsive hardening, resilient loading/error states, cross-browser CI, complete release documentation and Vercel deployment guidance.

## Technical risks

- RLS mistakes can expose minors’ progress or answer data; policies and negative tests are release blockers.
- Written-response marking is nuanced; deterministic rubrics need careful content review and manual overrides.
- Exam autosave must survive refreshes and poor connections without accepting edits after expiry.
- Official specification structures change; source/version metadata and archive paths are needed.
- Charts and motion require text equivalents and reduced-motion behaviour.
