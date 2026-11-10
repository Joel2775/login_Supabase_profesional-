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

const { CreateStudent } = require("../src/domain/use-cases/students/create-student.ts");
const {
  SupabaseStudentRepository,
} = require("../src/data/academic/supabase-student-repository.ts");

const userId = "user-1";
const student = {
  id: "student-1",
  user_id: userId,
  identification: "ID-123",
  first_name: "Ana",
  last_name: "Lopez",
  email: "ana@example.com",
  phone: null,
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

test("creates a student with the authenticated owner and maps the row", async () => {
  const { supabase, queries } = createSupabase({ data: student, error: null });
  const repository = new SupabaseStudentRepository(supabase);

  const result = await repository.create({
    identification: "ID-123",
    firstName: "Ana",
    lastName: "Lopez",
  });

  assert.equal(result.id, student.id);
  assert.equal(result.userId, userId);
  assert.equal(queries[0].operation, "insert");
  assert.equal(queries[0].payload.user_id, userId);
  assert.equal(queries[0].payload.email, null);
});

test("lists only the current user's students", async () => {
  const { supabase, queries } = createSupabase({
    data: [student],
    error: null,
  });
  const repository = new SupabaseStudentRepository(supabase);

  const result = await repository.getAll();

  assert.equal(result.length, 1);
  assert.deepEqual(queries[0].filters, [["user_id", userId]]);
  assert.deepEqual(queries[0].orderBy, [
    "created_at",
    { ascending: false },
  ]);
});

test("gets one student scoped by both ID and owner", async () => {
  const { supabase, queries } = createSupabase({ data: student, error: null });
  const repository = new SupabaseStudentRepository(supabase);

  const result = await repository.getById(student.id);

  assert.equal(result.identification, student.identification);
  assert.deepEqual(queries[0].filters, [
    ["id", student.id],
    ["user_id", userId],
  ]);
});

test("updates only provided fields for the current owner", async () => {
  const updatedStudent = { ...student, first_name: "Ana Maria" };
  const { supabase, queries } = createSupabase({
    data: updatedStudent,
    error: null,
  });
  const repository = new SupabaseStudentRepository(supabase);

  const result = await repository.update(student.id, {
    firstName: "Ana Maria",
  });

  assert.equal(result.firstName, "Ana Maria");
  assert.deepEqual(queries[0].payload, { first_name: "Ana Maria" });
  assert.deepEqual(queries[0].filters, [
    ["id", student.id],
    ["user_id", userId],
  ]);
});

test("deletes a student and scopes the deletion to the current owner", async () => {
  const { supabase, queries } = createSupabase({
    data: { id: student.id },
    error: null,
  });
  const repository = new SupabaseStudentRepository(supabase);

  await repository.delete(student.id);

  assert.equal(queries[0].operation, "delete");
  assert.deepEqual(queries[0].filters, [
    ["id", student.id],
    ["user_id", userId],
  ]);
});

test("does not report a missing student delete as successful", async () => {
  const { supabase } = createSupabase({ data: null, error: null });
  const repository = new SupabaseStudentRepository(supabase);

  await assert.rejects(repository.delete(student.id), /no existe o no está disponible/);
});

test("maps duplicate identification errors to a clear message", async () => {
  const { supabase } = createSupabase({
    data: null,
    error: { code: "23505", message: "duplicate key" },
  });
  const repository = new SupabaseStudentRepository(supabase);

  await assert.rejects(
    repository.create({
      identification: "ID-123",
      firstName: "Ana",
      lastName: "Lopez",
    }),
    /Ya existe el estudiante con esos datos/,
  );
});

test("validates and normalizes student creation before repository access", async () => {
  let receivedInput;
  const createStudent = new CreateStudent({
    create: async (input) => {
      receivedInput = input;
      return { ...student, identification: input.identification };
    },
  });

  await createStudent.execute({
    identification: " ID-123 ",
    firstName: " Ana ",
    lastName: " Lopez ",
    email: " ana@example.com ",
    phone: " ",
  });

  assert.deepEqual(receivedInput, {
    identification: "ID-123",
    firstName: "Ana",
    lastName: "Lopez",
    email: "ana@example.com",
    phone: null,
  });
  assert.throws(
    () =>
      createStudent.execute({
      identification: "ID-124",
      firstName: "Ana",
      lastName: "Lopez",
      email: "invalid",
      }),
    /formato válido/,
  );
});
