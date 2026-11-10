create table public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  constraint courses_name_not_blank check (btrim(name) <> ''),
  constraint courses_id_user_unique unique (id, user_id)
);

create unique index courses_user_normalized_name_unique
  on public.courses (user_id, lower(btrim(name)));
