-- Role-based onboarding. Version 2 asks every account to explicitly choose
-- student/teacher plus the course they study or teach.
alter table public.profiles
  add column if not exists onboarding_version smallint not null default 1
  check (onboarding_version between 1 and 10);

create or replace function public.complete_onboarding(
  requested_role public.app_role,
  requested_course uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if requested_role not in ('student'::public.app_role, 'teacher'::public.app_role) then
    raise exception 'Choose student or teacher';
  end if;

  if not exists (
    select 1 from public.courses
    where id = requested_course and published and archived_at is null
  ) then
    raise exception 'Choose an available course';
  end if;

  update public.user_course_enrolments
  set is_active = false, updated_at = now()
  where user_id = current_user_id and is_active;

  insert into public.user_course_enrolments (user_id, course_id, is_active)
  values (current_user_id, requested_course, true)
  on conflict (user_id, course_id)
  do update set is_active = true, updated_at = now();

  delete from public.user_roles
  where user_id = current_user_id and role in ('student', 'teacher');

  insert into public.user_roles (user_id, role)
  values (current_user_id, requested_role)
  on conflict (user_id, role) do nothing;

  update public.profiles
  set onboarding_completed = true, onboarding_version = 2, updated_at = now()
  where id = current_user_id;

  if not found then
    raise exception 'Profile not found';
  end if;
end;
$$;

revoke all on function public.complete_onboarding(public.app_role, uuid) from public;
grant execute on function public.complete_onboarding(public.app_role, uuid) to authenticated;

-- Students can join by a server-hashed code without exposing class records or
-- requiring a service-role key in the web application.
create or replace function public.join_class_by_hash(requested_hash text)
returns table(class_id uuid, class_name text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  matched_id uuid;
  matched_name text;
begin
  if auth.uid() is null or not public.has_role('student') then
    return;
  end if;

  select id, name into matched_id, matched_name
  from public.classes
  where join_code_hash = requested_hash and archived_at is null;

  if matched_id is null then
    return;
  end if;

  insert into public.class_memberships (class_id, student_id, removed_at)
  values (matched_id, auth.uid(), null)
  on conflict (class_id, student_id)
  do update set removed_at = null, joined_at = now();

  return query select matched_id, matched_name;
end;
$$;

revoke all on function public.join_class_by_hash(text) from public;
grant execute on function public.join_class_by_hash(text) to authenticated;
