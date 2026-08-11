-- Phase 10: atomically enforce fair-use limits under concurrent requests.
create or replace function public.consume_limited_feature_usage(
  requested_user uuid,
  requested_feature text,
  requested_period_start timestamptz,
  requested_period_end timestamptz,
  requested_quantity integer,
  requested_limit bigint
) returns bigint
language plpgsql
security definer
set search_path=''
as $$
declare current_quantity bigint;
begin
  if requested_quantity <= 0 then raise exception 'invalid_usage_quantity' using errcode='22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(requested_user::text || requested_feature || requested_period_start::text, 0));
  select quantity into current_quantity from public.usage_records
    where user_id=requested_user and feature_key=requested_feature and period_start=requested_period_start;
  current_quantity := coalesce(current_quantity,0);
  if requested_limit is not null and current_quantity + requested_quantity > requested_limit then
    raise exception 'feature_usage_limit_reached' using errcode='P0001';
  end if;
  insert into public.usage_records(user_id,feature_key,period_start,period_end,quantity,last_used_at)
    values(requested_user,requested_feature,requested_period_start,requested_period_end,requested_quantity,now())
  on conflict(user_id,feature_key,period_start) do update
    set quantity=public.usage_records.quantity+excluded.quantity, period_end=excluded.period_end, last_used_at=now(), updated_at=now()
  returning quantity into current_quantity;
  return current_quantity;
end;
$$;

revoke all on function public.consume_limited_feature_usage(uuid,text,timestamptz,timestamptz,integer,bigint) from public, anon, authenticated;
grant execute on function public.consume_limited_feature_usage(uuid,text,timestamptz,timestamptz,integer,bigint) to service_role;
