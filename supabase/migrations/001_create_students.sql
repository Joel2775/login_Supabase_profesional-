create table public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  identification text not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  constraint students_identification_not_blank
    check (identification = btrim(identification) and identification <> ''),
  constraint students_first_name_not_blank
    check (btrim(first_name) <> ''),
  constraint students_last_name_not_blank
    check (btrim(last_name) <> ''),
  constraint students_email_format
    check (
      email is null
      or (
        email = btrim(email)
        and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      )
    ),
  constraint students_user_identification_unique unique (user_id, identification),
  constraint students_id_user_unique unique (id, user_id)
);
