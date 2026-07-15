-- Accounts created before the initial schema was installed did not pass through
-- the profile provisioning trigger. Provision those accounts without creating
-- any progress, enrolment, or attempt records.
insert into public.profiles (id, display_name)
select
  users.id,
  case
    when char_length(trim(coalesce(users.raw_user_meta_data ->> 'display_name', ''))) between 2 and 50
      then trim(users.raw_user_meta_data ->> 'display_name')
    else 'Student'
  end
from auth.users as users
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select users.id, 'student'::public.app_role
from auth.users as users
on conflict (user_id, role) do nothing;
