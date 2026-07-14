# Database and security model

The migration defines the complete planned domain so later phases can build without destructive redesign. Content follows:

`qualification → exam board → course → specification section → topic → subtopic → lesson / flashcard / worked solution / question`.

Student activity is separated into enrolments, lesson progress, flashcard reviews, practice attempts, answers, marking results, mastery and achievements. Teacher data uses classes, memberships, assignments, targets and submissions. Administrative traceability uses reports, immutable content snapshots and audit logs.

## Row Level Security

- A student can read and update only their profile, enrolments and progress.
- Attempt answers can be changed only while the owning attempt is in progress.
- Marking results become readable only after submission.
- Correct answers and rubric tables have no student policy or authenticated-client grant.
- Teachers manage only classes they own and memberships within those classes.
- Administrators are recognised by a database role lookup, never browser state.
- Role changes and audit-log writes require trusted server code; client grants are revoked.
- Published catalogue and lesson content is broadly readable; drafts are admin-only.

The `handle_new_user` trigger creates a profile and student role after Supabase Auth registration. It never accepts a requested role from signup metadata.

## Important future work

Before the practice engine ships, marking and submission must be implemented as transactional, security-definer database functions with a fixed `search_path`, explicit ownership checks and rate limits. Teacher progress policies should expose only class members and the minimum required profile fields. Account deletion should use a verified server action that deletes the Auth user, allowing cascading personal-data deletion.
