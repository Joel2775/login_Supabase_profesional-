import type { Course } from "@/domain/entities/course";
import type { Enrollment } from "@/domain/entities/enrollment";
import type { Student } from "@/domain/entities/student";
import type { EnrollmentRepository } from "@/domain/repositories/enrollment-repository";
import { mapCourse, mapEnrollment, mapStudent } from "./academic-mappers";
import {
  requireCurrentUserId,
  throwSupabaseError,
  type AppSupabaseClient,
} from "./supabase-errors";

const COURSE_COLUMNS = "id,user_id,name,description,created_at";
const STUDENT_COLUMNS =
  "id,user_id,identification,first_name,last_name,email,phone,created_at";

export class SupabaseEnrollmentRepository implements EnrollmentRepository {
  constructor(private readonly supabase: AppSupabaseClient) {}

  async enroll(studentId: string, courseIds: string[]): Promise<Enrollment[]> {
    const { data, error } = await this.supabase.rpc(
      "enroll_student_in_courses",
      {
        p_student_id: studentId,
        p_course_ids: courseIds,
      },
    );

    if (error) {
      throwSupabaseError(error, "No se pudo inscribir al estudiante", "la inscripción");
    }
    return data.map(mapEnrollment);
  }

  async getStudentCourses(studentId: string): Promise<Course[]> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data: student, error: studentError } = await this.supabase
      .from("students")
      .select("id")
      .eq("id", studentId)
      .eq("user_id", userId)
      .maybeSingle();

    if (studentError) {
      throwSupabaseError(
        studentError,
        "No se pudo verificar el estudiante",
        "el estudiante",
      );
    }
    if (!student) {
      throw new Error("El estudiante no existe o no está disponible.");
    }

    const { data: enrollments, error: enrollmentsError } = await this.supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", studentId)
      .eq("user_id", userId);

    if (enrollmentsError) {
      throwSupabaseError(
        enrollmentsError,
        "No se pudieron consultar las inscripciones del estudiante",
        "las inscripciones",
      );
    }
    if (enrollments.length === 0) return [];

    const { data, error } = await this.supabase
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("user_id", userId)
      .in(
        "id",
        enrollments.map((enrollment) => enrollment.course_id),
      )
      .order("name", { ascending: true });

    if (error) {
      throwSupabaseError(
        error,
        "No se pudieron consultar los cursos del estudiante",
        "los cursos",
      );
    }
    return data.map(mapCourse);
  }

  async getCourseStudents(courseId: string): Promise<Student[]> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data: course, error: courseError } = await this.supabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .eq("user_id", userId)
      .maybeSingle();

    if (courseError) {
      throwSupabaseError(
        courseError,
        "No se pudo verificar el curso",
        "el curso",
      );
    }
    if (!course) {
      throw new Error("El curso no existe o no está disponible.");
    }

    const { data: enrollments, error: enrollmentsError } = await this.supabase
      .from("enrollments")
      .select("student_id")
      .eq("course_id", courseId)
      .eq("user_id", userId);

    if (enrollmentsError) {
      throwSupabaseError(
        enrollmentsError,
        "No se pudieron consultar las inscripciones del curso",
        "las inscripciones",
      );
    }
    if (enrollments.length === 0) return [];

    const { data, error } = await this.supabase
      .from("students")
      .select(STUDENT_COLUMNS)
      .eq("user_id", userId)
      .in(
        "id",
        enrollments.map((enrollment) => enrollment.student_id),
      )
      .order("last_name", { ascending: true });

    if (error) {
      throwSupabaseError(
        error,
        "No se pudieron consultar los estudiantes del curso",
        "los estudiantes",
      );
    }
    return data.map(mapStudent);
  }

  async remove(id: string): Promise<void> {
    const userId = await requireCurrentUserId(this.supabase);
    const { data, error } = await this.supabase
      .from("enrollments")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) {
      throwSupabaseError(error, "No se pudo retirar la inscripción", "la inscripción");
    }
    if (!data) {
      throw new Error("La inscripción no existe o no está disponible.");
    }
  }
}
