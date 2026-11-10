create function public.enroll_student_in_courses(
  p_student_id uuid,
  p_course_ids uuid[]
)
returns setof public.enrollments
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'An authenticated user is required.'
      using errcode = '42501';
  end if;

  if p_student_id is null
    or p_course_ids is null
    or cardinality(p_course_ids) = 0
    or array_position(p_course_ids, null) is not null
  then
    raise exception 'A student and at least one valid course are required.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.students as student
    where student.id = p_student_id
      and student.user_id = v_user_id
  ) then
    raise exception 'The student does not exist or is not owned by the current user.'
      using errcode = '23503';
  end if;

  if exists (
    select 1
    from (select distinct unnest(p_course_ids) as course_id) as requested
    left join public.courses as course
      on course.id = requested.course_id
      and course.user_id = v_user_id
    where course.id is null
  ) then
    raise exception 'A course does not exist or is not owned by the current user.'
      using errcode = '23503';
  end if;

  return query
    insert into public.enrollments (user_id, student_id, course_id)
    select v_user_id, p_student_id, requested.course_id
    from (select distinct unnest(p_course_ids) as course_id) as requested
    on conflict (student_id, course_id) do nothing
    returning *;
end;
$$;

revoke all on function public.enroll_student_in_courses(uuid, uuid[]) from public, anon;
grant execute on function public.enroll_student_in_courses(uuid, uuid[]) to authenticated;
