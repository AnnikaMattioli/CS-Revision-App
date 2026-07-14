# Section-by-section roadmap

## Phase 1 — Foundation (current)

Next.js setup, original design system, Supabase boundary, full schema migration, RLS, authentication, roles, onboarding, navigation, demo-aware dashboard, documentation and baseline tests.

## Phase 2 — Course content (completed)

Course hierarchy, real topic and lesson pages, persisted lesson progress, active-recall flashcards and worked solutions using representative original content. The initial content is deliberately limited to three OCR GCSE sample topics.

## Phase 3 — Practice engine

Question renderers, set creation, autosave, protected submission, objective/rubric marking, results and attempt history.

## Phase 4 — Progress and adaptation

Mastery calculation, progress charts, adaptive selection, weak-area recommendations, achievements and streaks.

## Phase 5 — Exam mode

Timed assessments, question palette, warnings, auto-submission, results and time analysis.

## Phase 6 — Teacher tools

Classes, secure joining codes, assignments, class membership and minimal-data analytics.

## Phase 7 — Administrator tools

Content management, question editor, validated import preview, reports, role management and audits.

## Phase 8 — Quality and deployment

Security and accessibility audits, responsive/browser coverage, performance work, complete automated workflows and Vercel deployment guidance.

## Technical risks

- RLS mistakes can expose minors’ progress or answer data; policies and negative tests are release blockers.
- Written-response marking is nuanced; deterministic rubrics need careful content review and manual overrides.
- Exam autosave must survive refreshes and poor connections without accepting edits after expiry.
- Official specification structures change; source/version metadata and archive paths are needed.
- Charts and motion require text equivalents and reduced-motion behaviour.
