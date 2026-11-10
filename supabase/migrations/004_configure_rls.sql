alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

create policy students_select_own
  on public.students for select to authenticated
  using (user_id = (select auth.uid()));

create policy students_insert_own
  on public.students for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy students_update_own
  on public.students for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy students_delete_own
  on public.students for delete to authenticated
  using (user_id = (select auth.uid()));

create policy courses_select_own
  on public.courses for select to authenticated
  using (user_id = (select auth.uid()));

create policy courses_insert_own
  on public.courses for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy courses_update_own
  on public.courses for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy courses_delete_own
  on public.courses for delete to authenticated
  using (user_id = (select auth.uid()));

create policy enrollments_select_own
  on public.enrollments for select to authenticated
  using (user_id = (select auth.uid()));

create policy enrollments_insert_own
  on public.enrollments for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy enrollments_update_own
  on public.enrollments for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy enrollments_delete_own
  on public.enrollments for delete to authenticated
  using (user_id = (select auth.uid()));

revoke all on table public.students, public.courses, public.enrollments from public, anon;
grant select, insert, update, delete
  on table public.students, public.courses, public.enrollments
  to authenticated;
