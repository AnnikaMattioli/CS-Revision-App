# Database and security model

The migration defines the complete planned domain so later phases can build without destructive redesign. Content follows:

`qualification → exam board → course → specification section → topic → subtopic → lesson / flashcard / worked solution / question`.

Student activity is separated into enrolments, lesson progress, flashcard reviews, practice attempts, answers, marking results, mastery and achievements. Teacher data uses classes, memberships, assignments, targets and submissions. Administrative traceability uses reports, immutable content snapshots and audit logs.

Daily aggregates in `study_activity_days` support streaks and activity summaries without exposing individual responses or repeatedly scanning complete answer histories. Topic mastery stores the bounded score, confidence label, accuracy, trend and student-facing explanation produced after trusted marking.

## Row Level Security

- A student can read and update only their profile, enrolments and progress.
- Attempt answers can be created or changed only while the owning attempt is in progress and the question belongs to its stored practice set.
- Marking results become readable only after submission.
- Correct answers and rubric tables have no student policy or authenticated-client grant.
- Teachers manage only classes they own and memberships within those classes.
- Administrators are recognised by a database role lookup, never browser state.
- Role changes and audit-log writes require trusted server code; client grants are revoked.
- Published catalogue and lesson content is broadly readable; drafts are admin-only.

The `handle_new_user` trigger creates a profile and student role after Supabase Auth registration. It never accepts a requested role from signup metadata.

Deleting a verified Supabase Auth user cascades through the profile and user-owned learning tables. The application exposes this only through a rate-limited server route that verifies the current session and explicit `DELETE` confirmation.

## Trusted practice writes

Phase 3 creates owned practice sets and attempts through Row Level Security. Draft answers are autosaved with the signed-in student client. Submission rechecks the user, open-attempt status and exact set membership, then a server-only Supabase secret stores marking results and closes the attempt. Correct answers and rules never enter the pre-submission payload.

Exam papers extend practice sets with navigation, release and grade-boundary configuration. Attempts carry authoritative deadlines and automatic-submission state, while `exam_question_timings` stores bounded timing aggregates. Delayed exam marking remains unreadable under RLS until an explicit release time.

## Important future work

For additional defence in depth at larger scale, final answer writes and attempt closure should move into one transactional, security-definer database function with a fixed `search_path`. Production should combine the included application limits with deployment-edge distributed rate limits and periodically re-run negative RLS tests after schema changes.
