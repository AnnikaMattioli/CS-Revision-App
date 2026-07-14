# Marking system

Phase 3 uses deterministic server-side marking. The browser receives question prompts and interaction data, but answer rules, explanations, model answers and misconception feedback remain in server-only code or protected database tables until submission.

## Supported marking

- Multiple choice, true/false and fill-the-gap answers use normalised exact matching.
- Multiple-select questions award bounded partial credit and subtract marks for incorrect selections.
- Numerical questions accept a configured value and tolerance.
- Ordering and matching compare stable item identifiers rather than displayed wording.
- Short and extended responses use explicit, independently markable rubric concepts. Synonyms are normalised, each concept is awarded once, and configured contradiction phrases prevent unsafe keyword-only awards.
- Code-trace answers use the same protected exact or numerical rules.

Every result includes marks awarded, marks available, status, earned and missing concepts, improvement advice, a model answer, an explanation and a common misconception. Formal answers are returned only after a valid submission.

## Trust boundary

The submission route validates payload shape and question limits. For signed-in attempts it also verifies ownership, confirms the attempt is still open, and checks every submitted question belongs to the stored practice set. Marking results and attempt finalisation use the server-only Supabase secret client; Row Level Security limits students to their own attempts and only exposes marking after completion.

The engine is intentionally explainable rather than AI-scored. Rubrics need subject-expert review before expanding representative content into a full specification bank.
