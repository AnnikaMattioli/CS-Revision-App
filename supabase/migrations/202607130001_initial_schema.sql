-- Bytewise initial schema. Apply with `supabase db push`.
create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'teacher', 'admin');
create type public.qualification_level as enum ('GCSE', 'A_LEVEL');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.question_type as enum ('multiple_choice', 'multiple_select', 'short_answer', 'extended_answer', 'boolean', 'fill_blank', 'trace_table', 'ordering', 'matching');
create type public.difficulty_level as enum ('foundation', 'standard', 'stretch');
create type public.attempt_status as enum ('in_progress', 'submitted', 'marked', 'abandoned');
create type public.assignment_status as enum ('draft', 'published', 'archived');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 50),
  avatar_colour text not null default '#7357ee',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create or replace function public.has_role(required_role public.app_role)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role = required_role);
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Student'));
  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create table public.qualifications (
  id uuid primary key default gen_random_uuid(),
  level public.qualification_level not null unique,
  name text not null unique,
  sort_order smallint not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.exam_boards (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9_-]+$'),
  name text not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  qualification_id uuid not null references public.qualifications(id),
  exam_board_id uuid not null references public.exam_boards(id),
  slug text not null unique,
  title text not null,
  description text not null default '',
  accent_colour text not null default '#7357ee',
  published boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (qualification_id, exam_board_id)
);
create table public.specification_sections (
  id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade,
  code text not null, title text not null, description text not null default '', sort_order smallint not null default 0,
  status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(course_id, code)
);
create table public.topics (
  id uuid primary key default gen_random_uuid(), specification_section_id uuid not null references public.specification_sections(id) on delete cascade,
  slug text not null, title text not null, description text not null default '', icon text, estimated_minutes integer not null default 30 check(estimated_minutes > 0),
  learning_objectives text[] not null default '{}', sort_order smallint not null default 0, status public.content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(specification_section_id, slug)
);
create table public.subtopics (
  id uuid primary key default gen_random_uuid(), topic_id uuid not null references public.topics(id) on delete cascade,
  slug text not null, title text not null, description text not null default '', sort_order smallint not null default 0,
  status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(topic_id, slug)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(), subtopic_id uuid not null references public.subtopics(id) on delete cascade,
  slug text not null, title text not null, summary text not null default '', estimated_minutes integer not null default 10 check(estimated_minutes > 0),
  sort_order smallint not null default 0, status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(subtopic_id, slug)
);
create table public.lesson_sections (
  id uuid primary key default gen_random_uuid(), lesson_id uuid not null references public.lessons(id) on delete cascade,
  heading text not null, body jsonb not null default '{}', sort_order smallint not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.flashcards (
  id uuid primary key default gen_random_uuid(), subtopic_id uuid not null references public.subtopics(id) on delete cascade,
  front text not null, back text not null, hint text, sort_order smallint not null default 0, status public.content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.worked_solutions (
  id uuid primary key default gen_random_uuid(), subtopic_id uuid not null references public.subtopics(id) on delete cascade,
  title text not null, prompt text not null, steps jsonb not null default '[]', final_answer text not null, status public.content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(), subtopic_id uuid not null references public.subtopics(id),
  type public.question_type not null, difficulty public.difficulty_level not null default 'standard', prompt jsonb not null,
  marks smallint not null check(marks between 1 and 30), calculator_allowed boolean not null default false,
  status public.content_status not null default 'draft', version integer not null default 1 check(version > 0), created_by uuid references auth.users(id),
  archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.question_options (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.questions(id) on delete cascade,
  label text not null, content text not null, sort_order smallint not null default 0, unique(question_id, label)
);
-- Correct answers are isolated from student-readable question rows.
create table public.question_answer_rules (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.questions(id) on delete cascade,
  rule_type text not null, rule jsonb not null, feedback text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.question_rubrics (
  id uuid primary key default gen_random_uuid(), question_id uuid not null unique references public.questions(id) on delete cascade,
  guidance text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.question_rubric_points (
  id uuid primary key default gen_random_uuid(), rubric_id uuid not null references public.question_rubrics(id) on delete cascade,
  description text not null, marks smallint not null check(marks > 0), acceptable_terms text[] not null default '{}', sort_order smallint not null default 0
);
create table public.practice_sets (
  id uuid primary key default gen_random_uuid(), owner_id uuid references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id), title text not null, mode text not null default 'practice' check(mode in ('practice','exam','assignment')),
  time_limit_seconds integer check(time_limit_seconds is null or time_limit_seconds > 0), created_at timestamptz not null default now()
);
create table public.practice_set_questions (
  practice_set_id uuid not null references public.practice_sets(id) on delete cascade, question_id uuid not null references public.questions(id),
  sort_order smallint not null, primary key(practice_set_id, question_id), unique(practice_set_id, sort_order)
);
create table public.attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  practice_set_id uuid not null references public.practice_sets(id), status public.attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(), submitted_at timestamptz, marked_at timestamptz,
  score integer check(score >= 0), available_marks integer check(available_marks >= 0), duration_seconds integer check(duration_seconds >= 0), updated_at timestamptz not null default now()
);
create table public.attempt_answers (
  id uuid primary key default gen_random_uuid(), attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id), answer jsonb not null default '{}', flagged boolean not null default false,
  saved_at timestamptz not null default now(), unique(attempt_id, question_id)
);
create table public.marking_results (
  id uuid primary key default gen_random_uuid(), attempt_answer_id uuid not null unique references public.attempt_answers(id) on delete cascade,
  marks_awarded integer not null check(marks_awarded >= 0), feedback jsonb not null default '{}', rubric_evidence jsonb not null default '[]',
  marked_by text not null default 'deterministic' check(marked_by in ('deterministic','teacher','admin','ai_assisted')), created_at timestamptz not null default now()
);

create table public.user_course_enrolments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id), is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, course_id)
);
create unique index one_active_course_per_user on public.user_course_enrolments(user_id) where is_active;
create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade, lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false, progress_percent smallint not null default 0 check(progress_percent between 0 and 100),
  last_viewed_at timestamptz not null default now(), completed_at timestamptz, primary key(user_id, lesson_id)
);
create table public.flashcard_reviews (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade, rating smallint not null check(rating between 1 and 4), reviewed_at timestamptz not null default now(), next_review_at timestamptz
);
create table public.topic_mastery (
  user_id uuid not null references auth.users(id) on delete cascade, topic_id uuid not null references public.topics(id) on delete cascade,
  mastery_score numeric(5,2) not null default 0 check(mastery_score between 0 and 100), confidence text not null default 'new' check(confidence in ('new','developing','secure','mastered')),
  questions_seen integer not null default 0 check(questions_seen >= 0), updated_at timestamptz not null default now(), primary key(user_id, topic_id)
);
create table public.achievements (
  id uuid primary key default gen_random_uuid(), code text not null unique, title text not null, description text not null,
  icon text not null, criteria jsonb not null default '{}', published boolean not null default false, created_at timestamptz not null default now()
);
create table public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade, achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(), primary key(user_id, achievement_id)
);

create table public.classes (
  id uuid primary key default gen_random_uuid(), teacher_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id), name text not null, join_code_hash text not null unique, join_code_hint text not null,
  archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.class_memberships (
  class_id uuid not null references public.classes(id) on delete cascade, student_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(), removed_at timestamptz, primary key(class_id, student_id)
);
create table public.assignments (
  id uuid primary key default gen_random_uuid(), class_id uuid not null references public.classes(id) on delete cascade,
  title text not null, instructions text not null default '', due_at timestamptz, status public.assignment_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.assignment_targets (
  id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.assignments(id) on delete cascade,
  target_type text not null check(target_type in ('topic','practice_set')), topic_id uuid references public.topics(id), practice_set_id uuid references public.practice_sets(id),
  check((target_type='topic' and topic_id is not null and practice_set_id is null) or (target_type='practice_set' and practice_set_id is not null and topic_id is null))
);
create table public.assignment_submissions (
  assignment_id uuid not null references public.assignments(id) on delete cascade, student_id uuid not null references auth.users(id) on delete cascade,
  attempt_id uuid references public.attempts(id), submitted_at timestamptz not null default now(), primary key(assignment_id, student_id)
);

create table public.question_reports (
  id uuid primary key default gen_random_uuid(), question_id uuid references public.questions(id), reporter_id uuid not null references auth.users(id) on delete cascade,
  category text not null check(category in ('incorrect_answer','unclear_wording','marking_error','broken_diagram','technical','accessibility')),
  details text not null check(char_length(details) between 10 and 2000), status public.report_status not null default 'open', internal_notes text,
  resolved_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.content_versions (
  id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid not null, version integer not null,
  snapshot jsonb not null, changed_by uuid not null references auth.users(id), created_at timestamptz not null default now(), unique(entity_type, entity_id, version)
);
create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), action text not null,
  entity_type text not null, entity_id uuid, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);

-- Useful query indexes.
create index topics_section_idx on public.topics(specification_section_id, sort_order);
create index subtopics_topic_idx on public.subtopics(topic_id, sort_order);
create index questions_subtopic_idx on public.questions(subtopic_id, difficulty, status) where archived_at is null;
create index attempts_user_idx on public.attempts(user_id, started_at desc);
create index flashcard_reviews_due_idx on public.flashcard_reviews(user_id, next_review_at);
create index memberships_student_idx on public.class_memberships(student_id) where removed_at is null;
create index assignments_class_idx on public.assignments(class_id, due_at);
create index reports_status_idx on public.question_reports(status, created_at);

-- updated_at triggers.
do $$ declare t text; begin
  foreach t in array array['profiles','qualifications','exam_boards','courses','specification_sections','topics','subtopics','lessons','lesson_sections','flashcards','worked_solutions','questions','question_answer_rules','question_rubrics','user_course_enrolments','attempts','classes','assignments','question_reports']
  loop execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t); end loop;
end $$;

-- RLS is enabled even where policies are intentionally admin-only.
do $$ declare t text; begin
  foreach t in array array['profiles','user_roles','qualifications','exam_boards','courses','specification_sections','topics','subtopics','lessons','lesson_sections','flashcards','flashcard_reviews','worked_solutions','questions','question_options','question_answer_rules','question_rubrics','question_rubric_points','practice_sets','practice_set_questions','attempts','attempt_answers','marking_results','lesson_progress','topic_mastery','user_course_enrolments','achievements','user_achievements','classes','class_memberships','assignments','assignment_targets','assignment_submissions','question_reports','content_versions','admin_audit_logs']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

create policy "profiles read own" on public.profiles for select using(id = auth.uid());
create policy "profiles update own" on public.profiles for update using(id = auth.uid()) with check(id = auth.uid());
create policy "roles read own" on public.user_roles for select using(user_id = auth.uid());

create policy "catalogue read" on public.qualifications for select using(archived_at is null);
create policy "boards read" on public.exam_boards for select using(archived_at is null);
create policy "published courses read" on public.courses for select using(published and archived_at is null);
create policy "published sections read" on public.specification_sections for select using(status = 'published');
create policy "published topics read" on public.topics for select using(status = 'published');
create policy "published subtopics read" on public.subtopics for select using(status = 'published');
create policy "published lessons read" on public.lessons for select using(status = 'published');
create policy "published lesson sections read" on public.lesson_sections for select using(exists(select 1 from public.lessons l where l.id=lesson_id and l.status='published'));
create policy "published flashcards read" on public.flashcards for select using(status='published');
create policy "published solutions read" on public.worked_solutions for select using(status='published');
create policy "published question prompts read" on public.questions for select using(status='published' and archived_at is null);
create policy "published question options read" on public.question_options for select using(exists(select 1 from public.questions q where q.id=question_id and q.status='published' and q.archived_at is null));
-- No student SELECT policy exists on question_answer_rules or rubrics. Marking must run in a trusted server function.

create policy "enrolments own all" on public.user_course_enrolments for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "lesson progress own all" on public.lesson_progress for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "reviews own all" on public.flashcard_reviews for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "mastery own read" on public.topic_mastery for select using(user_id=auth.uid());
create policy "attempts own read" on public.attempts for select using(user_id=auth.uid());
create policy "attempts own create" on public.attempts for insert with check(user_id=auth.uid());
create policy "attempt answers via own attempt" on public.attempt_answers for all using(exists(select 1 from public.attempts a where a.id=attempt_id and a.user_id=auth.uid() and a.status='in_progress')) with check(exists(select 1 from public.attempts a where a.id=attempt_id and a.user_id=auth.uid() and a.status='in_progress'));
create policy "marking results after submit" on public.marking_results for select using(exists(select 1 from public.attempt_answers aa join public.attempts a on a.id=aa.attempt_id where aa.id=attempt_answer_id and a.user_id=auth.uid() and a.status in ('submitted','marked')));
create policy "achievements published read" on public.achievements for select using(published);
create policy "user achievements own read" on public.user_achievements for select using(user_id=auth.uid());
create policy "reports own create" on public.question_reports for insert with check(reporter_id=auth.uid());
create policy "reports own read" on public.question_reports for select using(reporter_id=auth.uid());

create policy "teachers manage own classes" on public.classes for all using(teacher_id=auth.uid() and public.has_role('teacher')) with check(teacher_id=auth.uid() and public.has_role('teacher'));
create policy "students read own memberships" on public.class_memberships for select using(student_id=auth.uid());
create policy "teachers manage memberships" on public.class_memberships for all using(exists(select 1 from public.classes c where c.id=class_id and c.teacher_id=auth.uid())) with check(exists(select 1 from public.classes c where c.id=class_id and c.teacher_id=auth.uid()));
create policy "class assignments visible" on public.assignments for select using(exists(select 1 from public.classes c left join public.class_memberships m on m.class_id=c.id where c.id=class_id and (c.teacher_id=auth.uid() or (m.student_id=auth.uid() and m.removed_at is null))));
create policy "teachers manage assignments" on public.assignments for all using(exists(select 1 from public.classes c where c.id=class_id and c.teacher_id=auth.uid())) with check(exists(select 1 from public.classes c where c.id=class_id and c.teacher_id=auth.uid()));

-- Admins receive CRUD on content through a single generated set of policies.
do $$ declare t text; begin
  foreach t in array array['qualifications','exam_boards','courses','specification_sections','topics','subtopics','lessons','lesson_sections','flashcards','worked_solutions','questions','question_options','question_answer_rules','question_rubrics','question_rubric_points','achievements','question_reports','content_versions']
  loop execute format('create policy "admins manage %1$s" on public.%1$I for all using (public.has_role(''admin'')) with check (public.has_role(''admin''))', t); end loop;
end $$;
create policy "admins read audit" on public.admin_audit_logs for select using(public.has_role('admin'));
create policy "admins read roles" on public.user_roles for select using(public.has_role('admin'));

-- Never grant clients permission to insert audit entries or change roles. Use audited server-only functions.
revoke all on public.admin_audit_logs from anon, authenticated;
revoke insert, update, delete on public.user_roles from anon, authenticated;
revoke all on public.question_answer_rules, public.question_rubrics, public.question_rubric_points from anon, authenticated;
grant select on public.question_answer_rules, public.question_rubrics, public.question_rubric_points to service_role;
