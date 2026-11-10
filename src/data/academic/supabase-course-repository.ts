import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from "@/domain/entities/course";
import type { CourseRepository } from "@/domain/repositories/course-repository";
import { mapCourse } from "./academic-mappers";
import {
  requireCurrentUserId,
  requireRecord,
  throwSupabaseError,
  type AppSupabaseClient,
} from "./supabase-errors";

const COURSE_COLUMNS = "id,user_id,name,description,created_at";

export class SupabaseCourseRepository implements CourseRepository {
  constructor(private readonly supabase: AppSupabaseClient) {}

  async create(input: CreateCourseInput): Promise<Course> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .insert({
        user_id: userId,
        name: input.name,
        description: input.description ?? null,
      })
      .select(COURSE_COLUMNS)
      .single();

    if (error) throwSupabaseError(error, "No se pudo crear el curso", "el curso");
    return mapCourse(data);
  }

  async getAll(): Promise<Course[]> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throwSupabaseError(error, "No se pudieron consultar los cursos", "los cursos");
    return data.map(mapCourse);
  }

  async getById(id: string): Promise<Course> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throwSupabaseError(error, "No se pudo consultar el curso", "el curso");
    return mapCourse(requireRecord(data, "El curso"));
  }

  async update(id: string, input: UpdateCourseInput): Promise<Course> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .update({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select(COURSE_COLUMNS)
      .maybeSingle();

    if (error) throwSupabaseError(error, "No se pudo actualizar el curso", "el curso");
    return mapCourse(requireRecord(data, "El curso"));
  }

  async delete(id: string): Promise<void> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("courses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) throwSupabaseError(error, "No se pudo eliminar el curso", "el curso");
    requireRecord(data, "El curso");
  }
}
