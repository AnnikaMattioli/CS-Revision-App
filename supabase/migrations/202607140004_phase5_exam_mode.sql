-- Phase 5: authoritative exam configuration, deadlines and per-question timing.
alter table public.practice_sets add column if not exists exam_kind text check(exam_kind is null or exam_kind in ('topic','mixed','custom','full_mock','assignment'));
alter table public.practice_sets add column if not exists allow_backwards boolean not null default true;
alter table public.practice_sets add column if not exists warn_unanswered boolean not null default true;
alter table public.practice_sets add column if not exists results_release text not null default 'immediate' check(results_release in ('immediate','later'));
alter table public.practice_sets add column if not exists results_released_at timestamptz;
alter table public.practice_sets add column if not exists grade_boundaries jsonb;
alter table public.practice_sets add column if not exists configuration jsonb not null default '{}';
alter table public.attempts add column if not exists deadline_at timestamptz;
alter table public.attempts add column if not exists auto_submitted boolean not null default false;

create table public.exam_question_timings (
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  seconds_spent integer not null default 0 check(seconds_spent between 0 and 86400),
  created_at timestamptz not null default now(),
  primary key(attempt_id, question_id)
);
alter table public.exam_question_timings enable row level security;
create policy "exam timings own read" on public.exam_question_timings for select using(exists(select 1 from public.attempts a where a.id=attempt_id and a.user_id=auth.uid()));
grant select on public.exam_question_timings to authenticated;
grant all on public.exam_question_timings to service_role;

drop policy "create answers for open set" on public.attempt_answers;
drop policy "update answers for open set" on public.attempt_answers;
create policy "create answers for open set" on public.attempt_answers for insert with check(
  exists(
    select 1 from public.attempts a
    join public.practice_set_questions psq on psq.practice_set_id=a.practice_set_id and psq.question_id=public.attempt_answers.question_id
    where a.id=public.attempt_answers.attempt_id and a.user_id=auth.uid() and a.status='in_progress' and (a.deadline_at is null or a.deadline_at > now())
  )
);
create policy "update answers for open set" on public.attempt_answers for update using(
  exists(select 1 from public.attempts a where a.id=attempt_id and a.user_id=auth.uid() and a.status='in_progress' and (a.deadline_at is null or a.deadline_at > now()))
) with check(
  exists(
    select 1 from public.attempts a
    join public.practice_set_questions psq on psq.practice_set_id=a.practice_set_id and psq.question_id=public.attempt_answers.question_id
    where a.id=public.attempt_answers.attempt_id and a.user_id=auth.uid() and a.status='in_progress' and (a.deadline_at is null or a.deadline_at > now())
  )
);

-- A hidden client screen is not a security boundary: delayed feedback stays blocked by RLS.
drop policy "marking results after submit" on public.marking_results;
create policy "marking results after release" on public.marking_results for select using(
  exists(
    select 1 from public.attempt_answers aa
    join public.attempts a on a.id=aa.attempt_id
    join public.practice_sets p on p.id=a.practice_set_id
    where aa.id=attempt_answer_id and a.user_id=auth.uid() and a.status in ('submitted','marked')
      and (p.mode <> 'exam' or p.results_release='immediate' or (p.results_released_at is not null and p.results_released_at <= now()))
  )
);

insert into public.achievements (id, code, title, description, icon, criteria, published) values
('70000000-0000-0000-0000-000000000007','first-exam','Under exam conditions','Complete your first timed test','⏱️','{"timed_tests":1}',true)
on conflict (code) do update set title=excluded.title, description=excluded.description, icon=excluded.icon, criteria=excluded.criteria, published=true;
