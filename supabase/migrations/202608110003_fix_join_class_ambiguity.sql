-- Qualify membership columns because the function's table return type also
-- defines class_id as a PL/pgSQL output variable.
create or replace function public.join_class_by_hash(requested_hash text)
returns table(class_id uuid, class_name text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  matched_id uuid;
  matched_name text;
  owner_id uuid;
  active_students bigint;
  allowed_students bigint;
begin
  if auth.uid() is null or not public.has_role('student') then
    return;
  end if;

  select c.id, c.name, c.teacher_id
  into matched_id, matched_name, owner_id
  from public.classes as c
  where c.join_code_hash = requested_hash and c.archived_at is null;

  if matched_id is null then
    return;
  end if;

  if exists (
    select 1
    from public.class_memberships as membership
    where membership.class_id = matched_id
      and membership.student_id = auth.uid()
      and membership.removed_at is null
  ) then
    return query select matched_id, matched_name;
    return;
  end if;

  select count(distinct membership.student_id)
  into active_students
  from public.class_memberships as membership
  join public.classes as teacher_class on teacher_class.id = membership.class_id
  where teacher_class.teacher_id = owner_id
    and teacher_class.archived_at is null
    and membership.removed_at is null;

  allowed_students := public.teacher_feature_limit(owner_id, 'teacher.max_active_students');
  if active_students >= allowed_students then
    raise exception 'teacher_active_student_limit_reached' using errcode = 'P0001';
  end if;

  insert into public.class_memberships (class_id, student_id, removed_at)
  values (matched_id, auth.uid(), null)
  on conflict on constraint class_memberships_pkey
  do update set removed_at = null, joined_at = now();

  return query select matched_id, matched_name;
end;
$$;

revoke all on function public.join_class_by_hash(text) from public;
grant execute on function public.join_class_by_hash(text) to authenticated;
