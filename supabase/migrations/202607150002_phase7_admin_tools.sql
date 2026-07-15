-- Phase 7: richer question metadata and server-enforced administrative workflows.
alter table public.questions add column if not exists estimated_seconds integer not null default 60 check(estimated_seconds between 10 and 7200);
alter table public.questions add column if not exists stimulus text;
alter table public.questions add column if not exists image_ref text;
alter table public.questions add column if not exists code_block text;
alter table public.questions add column if not exists explanation text not null default '';
alter table public.questions add column if not exists hints text[] not null default '{}';
alter table public.questions add column if not exists common_mistakes text[] not null default '{}';
alter table public.questions add column if not exists source_type text not null default 'original' check(source_type in ('original','teacher_authored','imported'));
alter table public.questions add column if not exists source_date date;
alter table public.questions add column if not exists import_key text unique;
create index if not exists questions_admin_filter_idx on public.questions(subtopic_id, status, difficulty, type);
create index if not exists audit_recent_idx on public.admin_audit_logs(created_at desc);
create index if not exists reports_admin_queue_idx on public.question_reports(status, created_at desc);

create or replace function public.admin_users()
returns table(user_id uuid, display_name text, roles public.app_role[])
language sql security definer stable set search_path=public as $$
  select p.id, p.display_name, array_agg(ur.role order by ur.role)
  from public.profiles p join public.user_roles ur on ur.user_id=p.id
  where public.has_role('admin') group by p.id,p.display_name order by p.display_name;
$$;

create or replace function public.admin_set_user_role(target_user uuid, requested_role public.app_role)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.has_role('admin') then raise exception 'administrator required'; end if;
  if target_user=auth.uid() and requested_role<>'admin' then raise exception 'administrators cannot remove their own access'; end if;
  delete from public.user_roles where user_id=target_user;
  insert into public.user_roles(user_id,role) values(target_user,requested_role);
  insert into public.admin_audit_logs(actor_id,action,entity_type,entity_id,metadata)
  values(auth.uid(),'role.changed','user',target_user,jsonb_build_object('role',requested_role));
end; $$;

create or replace function public.admin_question_performance()
returns table(question_id uuid, attempts bigint, average_percent numeric, incorrect_count bigint)
language sql security definer stable set search_path=public as $$
  select aa.question_id, count(*), round(avg(case when q.marks>0 then mr.marks_awarded::numeric/q.marks*100 else 0 end),1), count(*) filter(where mr.marks_awarded<q.marks)
  from public.attempt_answers aa join public.marking_results mr on mr.attempt_answer_id=aa.id join public.questions q on q.id=aa.question_id
  where public.has_role('admin') group by aa.question_id;
$$;

-- One RPC call is one database transaction. Validated rows either all import or all roll back.
create or replace function public.admin_import_questions(payload jsonb)
returns integer language plpgsql security definer set search_path=public as $$
declare item jsonb; inserted_count integer := 0; new_id uuid;
begin
  if not public.has_role('admin') then raise exception 'administrator required'; end if;
  if jsonb_typeof(payload)<>'array' or jsonb_array_length(payload)>250 then raise exception 'invalid import payload'; end if;
  for item in select * from jsonb_array_elements(payload) loop
    insert into public.questions(subtopic_id,type,difficulty,prompt,marks,calculator_allowed,status,created_by,estimated_seconds,stimulus,image_ref,code_block,explanation,hints,common_mistakes,source_type,source_date,import_key)
    values((item->>'subtopicId')::uuid,(item->>'type')::public.question_type,(item->>'difficulty')::public.difficulty_level,jsonb_build_object('prompt',item->>'prompt'),(item->>'marks')::smallint,coalesce((item->>'calculatorAllowed')::boolean,false),'draft',auth.uid(),coalesce((item->>'estimatedSeconds')::integer,60),nullif(item->>'stimulus',''),nullif(item->>'imageRef',''),nullif(item->>'codeBlock',''),coalesce(item->>'explanation',''),coalesce(array(select jsonb_array_elements_text(item->'hints')),'{}'),coalesce(array(select jsonb_array_elements_text(item->'commonMistakes')),'{}'),'imported',current_date,item->>'importKey')
    on conflict(import_key) do nothing returning id into new_id;
    if new_id is not null then
      insert into public.question_answer_rules(question_id,rule_type,rule,feedback) values(new_id,item->>'ruleType',item->'answerRule',item->>'feedback');
      inserted_count := inserted_count + 1; new_id := null;
    end if;
  end loop;
  insert into public.admin_audit_logs(actor_id,action,entity_type,metadata) values(auth.uid(),'questions.imported','question_import',jsonb_build_object('inserted',inserted_count));
  return inserted_count;
end; $$;

revoke all on function public.admin_users() from public;
revoke all on function public.admin_set_user_role(uuid,public.app_role) from public;
revoke all on function public.admin_question_performance() from public;
revoke all on function public.admin_import_questions(jsonb) from public;
grant execute on function public.admin_users() to authenticated;
grant execute on function public.admin_set_user_role(uuid,public.app_role) to authenticated;
grant execute on function public.admin_question_performance() to authenticated;
grant execute on function public.admin_import_questions(jsonb) to authenticated;
