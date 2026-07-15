-- Phase 6: secure class membership and privacy-minimising teacher access.
alter table public.classes add column if not exists join_code_rotated_at timestamptz not null default now();

create policy "members read joined classes" on public.classes for select using(
  exists(select 1 from public.class_memberships m where m.class_id=id and m.student_id=auth.uid() and m.removed_at is null)
);
create policy "teachers manage assignment targets" on public.assignment_targets for all using(
  exists(select 1 from public.assignments a join public.classes c on c.id=a.class_id where a.id=assignment_id and c.teacher_id=auth.uid())
) with check(
  exists(select 1 from public.assignments a join public.classes c on c.id=a.class_id where a.id=assignment_id and c.teacher_id=auth.uid())
);
create policy "members read assignment targets" on public.assignment_targets for select using(
  exists(select 1 from public.assignments a join public.class_memberships m on m.class_id=a.class_id where a.id=assignment_id and m.student_id=auth.uid() and m.removed_at is null)
);
create policy "students manage own submissions" on public.assignment_submissions for all using(student_id=auth.uid()) with check(
  student_id=auth.uid() and exists(select 1 from public.assignments a join public.class_memberships m on m.class_id=a.class_id where a.id=assignment_id and a.status='published' and m.student_id=auth.uid() and m.removed_at is null)
);
create policy "teachers read class submissions" on public.assignment_submissions for select using(
  exists(select 1 from public.assignments a join public.classes c on c.id=a.class_id where a.id=assignment_id and c.teacher_id=auth.uid())
);

-- Returns only the minimum student identity needed for a teacher's own class.
create or replace function public.teacher_class_students(requested_class uuid)
returns table(student_id uuid, display_name text, joined_at timestamptz)
language sql security definer stable set search_path=public as $$
  select m.student_id, p.display_name, m.joined_at
  from public.class_memberships m join public.profiles p on p.id=m.student_id
  where m.class_id=requested_class and m.removed_at is null
    and exists(select 1 from public.classes c where c.id=requested_class and c.teacher_id=auth.uid());
$$;
revoke all on function public.teacher_class_students(uuid) from public;
grant execute on function public.teacher_class_students(uuid) to authenticated;

-- Aggregated mastery only; this intentionally does not expose answers or account contact data.
create or replace function public.teacher_class_mastery(requested_class uuid)
returns table(topic_id uuid, average_mastery numeric, secure_students bigint, student_count bigint)
language sql security definer stable set search_path=public as $$
  select tm.topic_id, round(avg(tm.mastery_score),1), count(*) filter(where tm.mastery_score>=55), count(*)
  from public.topic_mastery tm join public.class_memberships m on m.student_id=tm.user_id
  where m.class_id=requested_class and m.removed_at is null
    and exists(select 1 from public.classes c where c.id=requested_class and c.teacher_id=auth.uid())
  group by tm.topic_id;
$$;
revoke all on function public.teacher_class_mastery(uuid) from public;
grant execute on function public.teacher_class_mastery(uuid) to authenticated;

create or replace function public.teacher_student_mastery(requested_class uuid, requested_student uuid)
returns table(topic_id uuid, mastery_score numeric, confidence text, accuracy_score numeric, questions_seen integer, updated_at timestamptz)
language sql security definer stable set search_path=public as $$
  select tm.topic_id, tm.mastery_score, tm.confidence, tm.accuracy_score, tm.questions_seen, tm.updated_at
  from public.topic_mastery tm
  where tm.user_id=requested_student
    and exists(select 1 from public.class_memberships m join public.classes c on c.id=m.class_id where m.class_id=requested_class and m.student_id=requested_student and m.removed_at is null and c.teacher_id=auth.uid());
$$;
revoke all on function public.teacher_student_mastery(uuid,uuid) from public;
grant execute on function public.teacher_student_mastery(uuid,uuid) to authenticated;
