-- Phase 4: explainable mastery, daily activity and positive achievements.
alter table public.topic_mastery add column if not exists accuracy_score numeric(5,2) not null default 0 check(accuracy_score between 0 and 100);
alter table public.topic_mastery add column if not exists trend text not null default 'steady' check(trend in ('up','steady','down'));
alter table public.topic_mastery add column if not exists explanation text not null default 'More practice evidence is needed.';
alter table public.topic_mastery drop constraint if exists topic_mastery_confidence_check;
alter table public.topic_mastery add constraint topic_mastery_confidence_check check(confidence in ('new','beginning','developing','secure','mastered'));

create table if not exists public.study_activity_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  questions_answered integer not null default 0 check(questions_answered >= 0),
  lessons_completed integer not null default 0 check(lessons_completed >= 0),
  flashcards_reviewed integer not null default 0 check(flashcards_reviewed >= 0),
  active_minutes integer not null default 0 check(active_minutes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(user_id, activity_date)
);
alter table public.study_activity_days enable row level security;
create policy "activity own read" on public.study_activity_days for select using(user_id=auth.uid());
create index if not exists activity_user_date_idx on public.study_activity_days(user_id, activity_date desc);
grant select on public.study_activity_days to authenticated;
grant all on public.study_activity_days to service_role;

insert into public.achievements (id, code, title, description, icon, criteria, published) values
('70000000-0000-0000-0000-000000000001','first-set','First steps','Complete your first practice set','🚀','{"sets":1}',true),
('70000000-0000-0000-0000-000000000002','week-streak','Seven-day spark','Revise on seven consecutive days','🔥','{"streak":7}',true),
('70000000-0000-0000-0000-000000000003','fifty-questions','Question explorer','Answer 50 practice questions','🧭','{"questions":50}',true),
('70000000-0000-0000-0000-000000000004','topic-secure','Secure foundations','Reach Secure mastery in one topic','🛡️','{"secure_topics":1}',true),
('70000000-0000-0000-0000-000000000005','mastery','Topic master','Reach Mastered in one topic','🏆','{"mastered_topics":1}',true),
('70000000-0000-0000-0000-000000000006','ten-sets','Consistent practice','Complete 10 practice sets','🎯','{"sets":10}',true)
on conflict (code) do update set title=excluded.title, description=excluded.description, icon=excluded.icon, criteria=excluded.criteria, published=true;
