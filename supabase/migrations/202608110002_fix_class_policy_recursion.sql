-- Avoid recursive RLS evaluation between classes and class_memberships.
-- The helper only answers whether the current authenticated user has an active
-- membership for one class; it does not expose membership rows or identities.
create or replace function public.is_active_class_member(requested_class uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
    from public.class_memberships
    where class_id = requested_class
      and student_id = auth.uid()
      and removed_at is null
  );
$$;

revoke all on function public.is_active_class_member(uuid) from public, anon;
grant execute on function public.is_active_class_member(uuid) to authenticated;

drop policy if exists "members read joined classes" on public.classes;
create policy "members read joined classes"
on public.classes
for select
using (public.is_active_class_member(id));
