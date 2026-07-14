# Exam mode

Phase 5 adds a separate timed assessment experience using the same protected question and deterministic marking foundations as practice mode.

## Paper configuration

Students can choose a topic, mixed, custom or full representative paper; question count; difficulty; time limit; backwards-navigation rule; unanswered warning; and immediate or delayed results. Qualification and exam board are explicit. Teacher-assigned papers use the same database mode, with assignment creation arriving in Phase 6.

The current demonstration bank contains ten original questions and therefore does not claim to be a full examination paper. Grade boundaries are nullable administrator configuration. The interface never invents an official grade estimate when boundaries have not deliberately been supplied.

## Exam runner

The runner covers the application shell to reduce distractions. It provides a live timer, autosave, answered/flagged/unanswered palette states, optional backwards navigation, low-time announcements, accidental-submission confirmation and automatic submission at expiry. Formal hints and answers are not rendered.

Per-question time is stored for signed-in attempts. Results include total marks, percentage, topic breakdown, longest question, average pace, detailed review and revision recommendations.

## Delayed-result security

Exam submission reads the stored paper configuration rather than trusting the browser’s requested release mode. Marking still happens on the server, but delayed responses return only a submission acknowledgement. Row Level Security also blocks direct reads from `marking_results` until the paper is configured for immediate release or `results_released_at` has passed.
