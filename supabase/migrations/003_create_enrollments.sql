create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  student_id uuid not null,
  course_id uuid not null,
  enrolled_at timestamptz not null default now(),
  constraint enrollments_student_user_fkey
    foreign key (student_id, user_id)
    references public.students (id, user_id)
    on delete cascade,
  constraint enrollments_course_user_fkey
    foreign key (course_id, user_id)
    references public.courses (id, user_id)
    on delete cascade,
  constraint enrollments_student_course_unique unique (student_id, course_id)
);

create index enrollments_course_id_idx on public.enrollments (course_id);
create index enrollments_user_id_idx on public.enrollments (user_id);
