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
  CreateCourse,
} = require("../src/domain/use-cases/courses/create-course.ts");
const {
  UpdateCourse,
} = require("../src/domain/use-cases/courses/update-course.ts");
const {
  SupabaseCourseRepository,
} = require("../src/data/academic/supabase-course-repository.ts");

const userId = "user-1";
const course = {
  id: "course-1",
  user_id: userId,
  name: "Programación",
  description: "Fundamentos",
  created_at: "2026-11-10T12:00:00.000Z",
};

function createSupabase(response) {
  const queries = [];
  const supabase = {
    auth: {
      getUser: async () => ({ data: { user: { id: userId } }, error: null }),
    },
    from(table) {
      const query = {
        table,
        filters: [],
        insert(payload) {
          this.operation = "insert";
          this.payload = payload;
          return this;
        },
        update(payload) {
          this.operation = "update";
          this.payload = payload;
          return this;
        },
        delete() {
          this.operation = "delete";
          return this;
        },
        select(columns) {
          this.columns = columns;
          return this;
        },
        eq(column, value) {
          this.filters.push([column, value]);
          return this;
        },
        order(column, options) {
          this.orderBy = [column, options];
          return this;
        },
        single() {
          return Promise.resolve(response);
        },
        maybeSingle() {
          return Promise.resolve(response);
        },
        then(resolve, reject) {
          return Promise.resolve(response).then(resolve, reject);
        },
      };
      queries.push(query);
      return query;
    },
  };
  return { supabase, queries };
}

test("creates a course with the authenticated owner and maps the row", async () => {
  const { supabase, queries } = createSupabase({ data: course, error: null });
  const repository = new SupabaseCourseRepository(supabase);

  const result = await repository.create({
    name: "Programación",
  });

  assert.equal(result.id, course.id);
  assert.equal(result.userId, userId);
  assert.equal(queries[0].operation, "insert");
  assert.equal(queries[0].payload.user_id, userId);
  assert.equal(queries[0].payload.description, null);
});

test("lists only the current user's courses", async () => {
  const { supabase, queries } = createSupabase({
    data: [course],
    error: null,
  });
  const repository = new SupabaseCourseRepository(supabase);

  const result = await repository.getAll();

  assert.equal(result.length, 1);
  assert.deepEqual(queries[0].filters, [["user_id", userId]]);
  assert.deepEqual(queries[0].orderBy, [
    "created_at",
    { ascending: false },
  ]);
});

test("gets one course scoped by both ID and owner", async () => {
  const { supabase, queries } = createSupabase({ data: course, error: null });
  const repository = new SupabaseCourseRepository(supabase);

  const result = await repository.getById(course.id);

  assert.equal(result.name, course.name);
  assert.deepEqual(queries[0].filters, [
    ["id", course.id],
    ["user_id", userId],
  ]);
});

test("updates only provided course fields and scopes by owner", async () => {
  const updatedCourse = { ...course, name: "Bases de datos" };
  const { supabase, queries } = createSupabase({
    data: updatedCourse,
    error: null,
  });
  const repository = new SupabaseCourseRepository(supabase);

  const result = await repository.update(course.id, { name: "Bases de datos" });

  assert.equal(result.name, "Bases de datos");
  assert.deepEqual(queries[0].payload, { name: "Bases de datos" });
  assert.deepEqual(queries[0].filters, [
    ["id", course.id],
    ["user_id", userId],
  ]);
});

test("deletes a course and scopes the deletion to the current owner", async () => {
  const { supabase, queries } = createSupabase({
    data: { id: course.id },
    error: null,
  });
  const repository = new SupabaseCourseRepository(supabase);

  await repository.delete(course.id);

  assert.equal(queries[0].operation, "delete");
  assert.deepEqual(queries[0].filters, [
    ["id", course.id],
    ["user_id", userId],
  ]);
});

test("does not report a missing course deletion as successful", async () => {
  const { supabase } = createSupabase({ data: null, error: null });
  const repository = new SupabaseCourseRepository(supabase);

  await assert.rejects(
    repository.delete(course.id),
    /no existe o no está disponible/,
  );
});

test("maps duplicate course-name errors to a clear message", async () => {
  const { supabase } = createSupabase({
    data: null,
    error: { code: "23505", message: "duplicate key" },
  });
  const repository = new SupabaseCourseRepository(supabase);

  await assert.rejects(
    repository.create({ name: "Programación" }),
    /Ya existe el curso con esos datos/,
  );
});

test("normalizes course creation input and rejects a blank course name", async () => {
  let receivedInput;
  const createCourse = new CreateCourse({
    create: async (input) => {
      receivedInput = input;
      return { ...course, name: input.name, description: input.description };
    },
  });

  await createCourse.execute({
    name: " Programación ",
    description: " ",
  });

  assert.deepEqual(receivedInput, {
    name: "Programación",
    description: null,
  });
  assert.throws(() => createCourse.execute({ name: "  " }), /obligatorio/);
});

test("normalizes course updates and rejects empty updates", async () => {
  let receivedInput;
  const updateCourse = new UpdateCourse({
    update: async (_id, input) => {
      receivedInput = input;
      return { ...course, description: input.description };
    },
  });

  await updateCourse.execute(course.id, { description: "  " });

  assert.deepEqual(receivedInput, { description: null });
  assert.throws(() => updateCourse.execute(course.id, {}), /al menos un campo/);
});
