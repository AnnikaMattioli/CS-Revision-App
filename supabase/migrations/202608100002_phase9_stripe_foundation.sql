create table public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete restrict,
  stripe_customer_id text not null unique,
  email_snapshot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  processing_status text not null default 'processing' check(processing_status in ('processing','processed','failed','ignored')),
  attempts integer not null default 1 check(attempts>0),
  error_summary text check(error_summary is null or char_length(error_summary)<=500),
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
create index stripe_events_status_idx on public.stripe_events(processing_status,received_at desc);
create unique index one_current_subscription_per_family on public.subscriptions(user_id,account_type)
  where status in ('trialing','active','past_due','unpaid','paused','incomplete');
alter table public.billing_customers enable row level security;
alter table public.stripe_events enable row level security;
create policy "billing customers read own" on public.billing_customers for select using(user_id=auth.uid());
create policy "admins read billing customers" on public.billing_customers for select using(public.has_role('admin'));
create policy "admins read stripe events" on public.stripe_events for select using(public.has_role('admin'));
revoke insert,update,delete on public.billing_customers,public.stripe_events from anon,authenticated;
grant all on public.billing_customers,public.stripe_events to service_role;
create trigger set_billing_customers_updated_at before update on public.billing_customers for each row execute function public.set_updated_at();
