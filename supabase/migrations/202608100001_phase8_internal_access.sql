-- Provider-independent plans, access grants and usage accounting.
-- Stripe-specific synchronisation is added separately in Phase 3.

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('student_free','student_plus_monthly','student_plus_annual','teacher_free','teacher_pro_monthly','teacher_pro_annual')),
  account_type text not null check (account_type in ('student','teacher')),
  provider text not null default 'internal' check (provider in ('internal','stripe','organisation','promotion')),
  provider_customer_id text,
  provider_subscription_id text,
  provider_price_id text,
  provider_product_id text,
  status text not null check (status in ('trialing','active','incomplete','incomplete_expired','past_due','unpaid','paused','canceled','ended')),
  billing_interval text not null check (billing_interval in ('free','month','year')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  ended_at timestamptz,
  latest_provider_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((account_type='student' and plan_id like 'student_%') or (account_type='teacher' and plan_id like 'teacher_%'))
);
create unique index subscriptions_provider_id_unique on public.subscriptions(provider, provider_subscription_id) where provider_subscription_id is not null;
create index subscriptions_user_status_idx on public.subscriptions(user_id, status, current_period_end desc);

create table public.plan_entitlements (
  plan_id text not null,
  entitlement_key text not null,
  enabled boolean not null default true,
  limit_value numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (plan_id, entitlement_key),
  check (limit_value is null or limit_value >= 0)
);

create table public.usage_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_key text not null,
  period_start timestamptz not null,
  period_end timestamptz not null,
  quantity integer not null default 0 check (quantity >= 0),
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, feature_key, period_start),
  check (period_end > period_start)
);
create index usage_records_user_period_idx on public.usage_records(user_id, feature_key, period_end desc);

create table public.complimentary_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text check (plan_id is null or plan_id in ('student_free','student_plus_monthly','student_plus_annual','teacher_free','teacher_pro_monthly','teacher_pro_annual')),
  entitlement_key text,
  reason text not null check (char_length(reason) between 3 and 500),
  granted_by uuid not null references auth.users(id),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(plan_id, entitlement_key) = 1),
  check (expires_at is null or expires_at > starts_at),
  check ((revoked_at is null and revoked_by is null) or (revoked_at is not null and revoked_by is not null))
);
create index complimentary_access_user_active_idx on public.complimentary_access(user_id, expires_at) where revoked_at is null;

create table public.subscription_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index subscription_audit_recent_idx on public.subscription_audit_logs(created_at desc);
create index subscription_audit_user_idx on public.subscription_audit_logs(user_id, created_at desc);

do $$ declare t text; begin
  foreach t in array array['subscriptions','plan_entitlements','usage_records','complimentary_access','subscription_audit_logs']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

create policy "subscriptions read own" on public.subscriptions for select using (user_id=auth.uid());
create policy "usage read own" on public.usage_records for select using (user_id=auth.uid());
create policy "complimentary access read own" on public.complimentary_access for select using (user_id=auth.uid());
create policy "plan entitlements authenticated read" on public.plan_entitlements for select to authenticated using (true);
create policy "admins manage subscriptions" on public.subscriptions for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "admins manage plan entitlements" on public.plan_entitlements for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "admins read usage" on public.usage_records for select using (public.has_role('admin'));
create policy "admins manage complimentary access" on public.complimentary_access for all using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "admins read subscription audit" on public.subscription_audit_logs for select using (public.has_role('admin'));

revoke insert, update, delete on public.subscriptions, public.plan_entitlements, public.usage_records, public.complimentary_access, public.subscription_audit_logs from anon, authenticated;
grant all on public.subscriptions, public.plan_entitlements, public.usage_records, public.complimentary_access, public.subscription_audit_logs to service_role;

create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger set_plan_entitlements_updated_at before update on public.plan_entitlements for each row execute function public.set_updated_at();
create trigger set_usage_records_updated_at before update on public.usage_records for each row execute function public.set_updated_at();
create trigger set_complimentary_access_updated_at before update on public.complimentary_access for each row execute function public.set_updated_at();

create or replace function public.secure_complimentary_grant_actor()
returns trigger language plpgsql set search_path='' as $$
begin
  if auth.uid() is not null then new.granted_by := auth.uid(); end if;
  return new;
end;
$$;
create trigger secure_complimentary_grant_actor before insert on public.complimentary_access for each row execute function public.secure_complimentary_grant_actor();

create or replace function public.consume_feature_usage(
  requested_user uuid,
  requested_feature text,
  requested_period_start timestamptz,
  requested_period_end timestamptz,
  requested_quantity integer
)
returns integer
language plpgsql
security definer
set search_path=''
as $$
declare new_quantity integer;
begin
  if requested_quantity <= 0 or requested_period_end <= requested_period_start then raise exception 'Invalid usage request'; end if;
  insert into public.usage_records(user_id,feature_key,period_start,period_end,quantity,last_used_at)
  values(requested_user,requested_feature,requested_period_start,requested_period_end,requested_quantity,now())
  on conflict(user_id,feature_key,period_start) do update
    set quantity=public.usage_records.quantity+excluded.quantity, period_end=excluded.period_end, last_used_at=now(), updated_at=now()
  returning quantity into new_quantity;
  return new_quantity;
end;
$$;
revoke all on function public.consume_feature_usage(uuid,text,timestamptz,timestamptz,integer) from public, anon, authenticated;
grant execute on function public.consume_feature_usage(uuid,text,timestamptz,timestamptz,integer) to service_role;

create or replace function public.audit_complimentary_access()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.subscription_audit_logs(actor_id,user_id,action,metadata)
  values(coalesce(auth.uid(),new.revoked_by,new.granted_by),new.user_id,case when tg_op='INSERT' then 'complimentary_access.granted' else 'complimentary_access.updated' end,
    jsonb_build_object('grant_id',new.id,'plan_id',new.plan_id,'entitlement_key',new.entitlement_key,'expires_at',new.expires_at,'revoked_at',new.revoked_at));
  return new;
end;
$$;
create trigger audit_complimentary_access_change after insert or update on public.complimentary_access for each row execute function public.audit_complimentary_access();

insert into public.plan_entitlements(plan_id,entitlement_key,limit_value) values
  ('student_free','student.max_custom_sets_per_period',3),
  ('student_free','student.max_ai_requests_per_period',0),
  ('student_free','student.max_generated_papers_per_period',0),
  ('student_plus_monthly','student.max_ai_requests_per_period',100),
  ('student_plus_monthly','student.max_generated_papers_per_period',20),
  ('student_plus_annual','student.max_ai_requests_per_period',100),
  ('student_plus_annual','student.max_generated_papers_per_period',20),
  ('teacher_free','teacher.max_active_classes',1),
  ('teacher_free','teacher.max_active_students',15),
  ('teacher_free','teacher.max_active_assignments',3),
  ('teacher_pro_monthly','teacher.max_active_classes',100),
  ('teacher_pro_monthly','teacher.max_active_students',2000),
  ('teacher_pro_monthly','teacher.max_active_assignments',10000),
  ('teacher_pro_annual','teacher.max_active_classes',100),
  ('teacher_pro_annual','teacher.max_active_students',2000),
  ('teacher_pro_annual','teacher.max_active_assignments',10000)
on conflict(plan_id,entitlement_key) do update set limit_value=excluded.limit_value, enabled=true;

create or replace function public.effective_teacher_plan(requested_teacher uuid)
returns text language sql security definer stable set search_path='' as $$
  select case
    when exists(select 1 from public.user_roles where user_id=requested_teacher and role='admin') then 'teacher_pro_annual'
    when exists(
      select 1 from public.subscriptions where user_id=requested_teacher and account_type='teacher'
        and plan_id in ('teacher_pro_monthly','teacher_pro_annual') and status in ('active','trialing')
        and (current_period_end is null or current_period_end>now())
    ) or exists(
      select 1 from public.complimentary_access where user_id=requested_teacher
        and plan_id in ('teacher_pro_monthly','teacher_pro_annual') and revoked_at is null
        and starts_at<=now() and (expires_at is null or expires_at>now())
    ) then 'teacher_pro_annual'
    else 'teacher_free'
  end;
$$;

create or replace function public.teacher_feature_limit(requested_teacher uuid, requested_feature text)
returns bigint language sql security definer stable set search_path='' as $$
  select coalesce(max(limit_value),0)::bigint from public.plan_entitlements
  where plan_id=public.effective_teacher_plan(requested_teacher) and entitlement_key=requested_feature and enabled;
$$;
revoke all on function public.effective_teacher_plan(uuid) from public, anon, authenticated;
revoke all on function public.teacher_feature_limit(uuid,text) from public, anon, authenticated;

create or replace function public.enforce_teacher_class_limit()
returns trigger language plpgsql security definer set search_path='' as $$
declare active_count bigint; allowed_count bigint;
begin
  select count(*) into active_count from public.classes where teacher_id=new.teacher_id and archived_at is null;
  allowed_count := public.teacher_feature_limit(new.teacher_id,'teacher.max_active_classes');
  if active_count >= allowed_count then raise exception 'teacher_active_class_limit_reached' using errcode='P0001'; end if;
  return new;
end;
$$;
create trigger enforce_teacher_class_limit before insert on public.classes for each row execute function public.enforce_teacher_class_limit();

create or replace function public.enforce_teacher_assignment_limit()
returns trigger language plpgsql security definer set search_path='' as $$
declare owner_id uuid; active_count bigint; allowed_count bigint;
begin
  select teacher_id into owner_id from public.classes where id=new.class_id;
  select count(*) into active_count from public.assignments a join public.classes c on c.id=a.class_id
    where c.teacher_id=owner_id and c.archived_at is null and a.status in ('draft','published');
  allowed_count := public.teacher_feature_limit(owner_id,'teacher.max_active_assignments');
  if active_count >= allowed_count then raise exception 'teacher_active_assignment_limit_reached' using errcode='P0001'; end if;
  return new;
end;
$$;
create trigger enforce_teacher_assignment_limit before insert on public.assignments for each row execute function public.enforce_teacher_assignment_limit();

create or replace function public.join_class_by_hash(requested_hash text)
returns table(class_id uuid, class_name text)
language plpgsql security definer set search_path='' as $$
declare matched_id uuid; matched_name text; owner_id uuid; active_students bigint; allowed_students bigint;
begin
  if auth.uid() is null or not public.has_role('student') then return; end if;
  select id,name,teacher_id into matched_id,matched_name,owner_id from public.classes where join_code_hash=requested_hash and archived_at is null;
  if matched_id is null then return; end if;
  if exists(select 1 from public.class_memberships where class_id=matched_id and student_id=auth.uid() and removed_at is null) then
    return query select matched_id,matched_name; return;
  end if;
  select count(distinct m.student_id) into active_students from public.class_memberships m join public.classes c on c.id=m.class_id
    where c.teacher_id=owner_id and c.archived_at is null and m.removed_at is null;
  allowed_students := public.teacher_feature_limit(owner_id,'teacher.max_active_students');
  if active_students >= allowed_students then raise exception 'teacher_active_student_limit_reached' using errcode='P0001'; end if;
  insert into public.class_memberships(class_id,student_id,removed_at) values(matched_id,auth.uid(),null)
    on conflict(class_id,student_id) do update set removed_at=null,joined_at=now();
  return query select matched_id,matched_name;
end;
$$;
revoke all on function public.join_class_by_hash(text) from public;
grant execute on function public.join_class_by_hash(text) to authenticated;
