import type {
  CreateStudentInput,
  Student,
  UpdateStudentInput,
} from "@/domain/entities/student";
import type { StudentRepository } from "@/domain/repositories/student-repository";
import { mapStudent } from "./academic-mappers";
import {
  requireCurrentUserId,
  requireRecord,
  throwSupabaseError,
  type AppSupabaseClient,
} from "./supabase-errors";

const STUDENT_COLUMNS =
  "id,user_id,identification,first_name,last_name,email,phone,created_at";

export class SupabaseStudentRepository implements StudentRepository {
  constructor(private readonly supabase: AppSupabaseClient) {}

  async create(input: CreateStudentInput): Promise<Student> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("students")
      .insert({
        user_id: userId,
        identification: input.identification,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email ?? null,
        phone: input.phone ?? null,
      })
      .select(STUDENT_COLUMNS)
      .single();

    if (error) throwSupabaseError(error, "No se pudo crear el estudiante", "el estudiante");
    return mapStudent(data);
  }

  async getAll(): Promise<Student[]> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("students")
      .select(STUDENT_COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throwSupabaseError(error, "No se pudieron consultar los estudiantes", "los estudiantes");
    return data.map(mapStudent);
  }

  async getById(id: string): Promise<Student> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("students")
      .select(STUDENT_COLUMNS)
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throwSupabaseError(error, "No se pudo consultar el estudiante", "el estudiante");
    return mapStudent(requireRecord(data, "El estudiante"));
  }

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("students")
      .update({
        ...(input.identification !== undefined && {
          identification: input.identification,
        }),
        ...(input.firstName !== undefined && { first_name: input.firstName }),
        ...(input.lastName !== undefined && { last_name: input.lastName }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select(STUDENT_COLUMNS)
      .maybeSingle();

    if (error) throwSupabaseError(error, "No se pudo actualizar el estudiante", "el estudiante");
    return mapStudent(requireRecord(data, "El estudiante"));
  }

  async delete(id: string): Promise<void> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("students")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) throwSupabaseError(error, "No se pudo eliminar el estudiante", "el estudiante");
    requireRecord(data, "El estudiante");
  }
}
