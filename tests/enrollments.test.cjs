const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const {
  EnrollStudent,
} = require("../src/domain/use-cases/enrollments/enroll-student.ts");
const {
  GetStudentCourses,
} = require("../src/domain/use-cases/enrollments/get-student-courses.ts");
const {
  GetCourseStudents,
} = require("../src/domain/use-cases/enrollments/get-course-students.ts");
const {
  RemoveEnrollment,
} = require("../src/domain/use-cases/enrollments/remove-enrollment.ts");
const {
  SupabaseEnrollmentRepository,
} = require("../src/data/academic/supabase-enrollment-repository.ts");

const userId = "user-1";
const student = {
  id: "student-1",
  user_id: userId,
  identification: "ID-123",
  first_name: "Ana",
  last_name: "Lopez",
  email: null,
  phone: null,
  created_at: "2026-11-10T12:00:00.000Z",
};
const course = {
  id: "course-1",
  user_id: userId,
  name: "Programación",
  description: null,
  created_at: "2026-11-10T12:00:00.000Z",
};
const enrollment = {
  id: "enrollment-1",
  user_id: userId,
  student_id: student.id,
  course_id: course.id,
  enrolled_at: "2026-11-10T12:00:00.000Z",
};

function createSupabase(responses = [], rpcResponse = { data: [], error: null }) {
  const queries = [];
  const rpcCalls = [];
  let responseIndex = 0;
  const supabase = {
    auth: {
      getUser: async () => ({ data: { user: { id: userId } }, error: null }),
    },
    from(table) {
      const query = {
        table,
        filters: [],
        select(columns) {
          this.columns = columns;
          return this;
        },
        eq(column, value) {
          this.filters.push([column, value]);
          return this;
        },
        in(column, values) {
          this.inFilter = [column, values];
          return this;
        },
        order(column, options) {
          this.orderBy = [column, options];
          return this;
        },
        delete() {
          this.operation = "delete";
          return this;
        },
        maybeSingle() {
          return Promise.resolve(responses[responseIndex++]);
        },
        then(resolve, reject) {
          return Promise.resolve(responses[responseIndex++]).then(resolve, reject);
        },
      };
      queries.push(query);
      return query;
    },
    rpc(name, args) {
      rpcCalls.push({ name, args });
      return Promise.resolve(rpcResponse);
    },
  };
  return { supabase, queries, rpcCalls };
}

test("enrolls a student in multiple courses through the transactional RPC", async () => {
  const secondEnrollment = { ...enrollment, id: "enrollment-2", course_id: "course-2" };
  const { supabase, rpcCalls } = createSupabase([], {
    data: [enrollment, secondEnrollment],
    error: null,
  });
  const repository = new SupabaseEnrollmentRepository(supabase);

  const result = await repository.enroll(student.id, [course.id, "course-2"]);

  assert.deepEqual(rpcCalls, [
    {
      name: "enroll_student_in_courses",
      args: {
        p_student_id: student.id,
        p_course_ids: [course.id, "course-2"],
      },
    },
  ]);
  assert.deepEqual(result, [
    {
      id: enrollment.id,
      userId,
      studentId: student.id,
      courseId: course.id,
      enrolledAt: enrollment.enrolled_at,
    },
    {
      id: secondEnrollment.id,
      userId,
      studentId: student.id,
      courseId: "course-2",
      enrolledAt: secondEnrollment.enrolled_at,
    },
  ]);
});

test("reports invalid ownership or foreign-key errors from the RPC", async () => {
  const { supabase } = createSupabase([], {
    data: null,
    error: { code: "23503", message: "record not owned" },
  });
  const repository = new SupabaseEnrollmentRepository(supabase);

  await assert.rejects(
    repository.enroll(student.id, [course.id]),
    /no existe o no pertenece a tu cuenta/,
  );
});

test("gets a student's courses only after confirming student ownership", async () => {
  const { supabase, queries } = createSupabase([
    { data: { id: student.id }, error: null },
    { data: [{ course_id: course.id }], error: null },
    { data: [course], error: null },
  ]);
  const repository = new SupabaseEnrollmentRepository(supabase);

  const result = await repository.getStudentCourses(student.id);

  assert.equal(result.length, 1);
  assert.equal(result[0].id, course.id);
  assert.deepEqual(queries[0].filters, [
    ["id", student.id],
    ["user_id", userId],
  ]);
  assert.deepEqual(queries[1].filters, [
    ["student_id", student.id],
    ["user_id", userId],
  ]);
  assert.deepEqual(queries[2].filters, [["user_id", userId]]);
  assert.deepEqual(queries[2].inFilter, ["id", [course.id]]);
});

test("does not query enrollments for a student owned by another user", async () => {
  const { supabase, queries } = createSupabase([
    { data: null, error: null },
  ]);
  const repository = new SupabaseEnrollmentRepository(supabase);

  await assert.rejects(
    repository.getStudentCourses(student.id),
    /El estudiante no existe o no está disponible/,
  );
  assert.equal(queries.length, 1);
});

test("gets a course's students only after confirming course ownership", async () => {
  const { supabase, queries } = createSupabase([
    { data: { id: course.id }, error: null },
    { data: [{ student_id: student.id }], error: null },
    { data: [student], error: null },
  ]);
  const repository = new SupabaseEnrollmentRepository(supabase);

  const result = await repository.getCourseStudents(course.id);

  assert.equal(result.length, 1);
  assert.equal(result[0].id, student.id);
  assert.deepEqual(queries[0].filters, [
    ["id", course.id],
    ["user_id", userId],
  ]);
  assert.deepEqual(queries[1].filters, [
    ["course_id", course.id],
    ["user_id", userId],
  ]);
  assert.deepEqual(queries[2].filters, [["user_id", userId]]);
  assert.deepEqual(queries[2].inFilter, ["id", [student.id]]);
});

test("removes one enrollment without deleting its student or course", async () => {
  const { supabase, queries } = createSupabase([
    { data: { id: enrollment.id }, error: null },
  ]);
  const repository = new SupabaseEnrollmentRepository(supabase);

  await repository.remove(enrollment.id);

  assert.equal(queries[0].table, "enrollments");
  assert.equal(queries[0].operation, "delete");
  assert.deepEqual(queries[0].filters, [
    ["id", enrollment.id],
    ["user_id", userId],
  ]);
});

test("reports an enrollment that was not found or owned", async () => {
  const { supabase } = createSupabase([{ data: null, error: null }]);
  const repository = new SupabaseEnrollmentRepository(supabase);

  await assert.rejects(
    repository.remove(enrollment.id),
    /inscripción no existe o no está disponible/,
  );
});

test("returns an empty course list after verifying the student exists", async () => {
  const { supabase, queries } = createSupabase([
    { data: { id: student.id }, error: null },
    { data: [], error: null },
  ]);
  const repository = new SupabaseEnrollmentRepository(supabase);

  assert.deepEqual(await repository.getStudentCourses(student.id), []);
  assert.equal(queries.length, 2);
});

test("validates multiple-course enrollment inputs before repository access", async () => {
  const calls = [];
  const enrollStudent = new EnrollStudent({
    enroll: async (studentId, courseIds) => {
      calls.push({ studentId, courseIds });
      return [];
    },
  });

  await enrollStudent.execute(student.id, [course.id, "course-2"]);
  assert.deepEqual(calls, [
    { studentId: student.id, courseIds: [course.id, "course-2"] },
  ]);
  assert.throws(() => enrollStudent.execute(student.id, []), /al menos un curso/);
  assert.throws(
    () => enrollStudent.execute(student.id, [course.id, course.id]),
    /cursos duplicados/,
  );
});

test("validates course and student lookup IDs before repository access", async () => {
  const repository = {
    getStudentCourses: async () => [],
    getCourseStudents: async () => [],
    remove: async () => {},
  };
  const getStudentCourses = new GetStudentCourses(repository);
  const getCourseStudents = new GetCourseStudents(repository);
  const removeEnrollment = new RemoveEnrollment(repository);

  assert.throws(() => getStudentCourses.execute(" "), /obligatorio/);
  assert.throws(() => getCourseStudents.execute(" "), /obligatorio/);
  assert.throws(() => removeEnrollment.execute(" "), /obligatorio/);
});
