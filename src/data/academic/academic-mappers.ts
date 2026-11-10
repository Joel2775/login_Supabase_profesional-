import type { Course } from "@/domain/entities/course";
import type { Enrollment } from "@/domain/entities/enrollment";
import type { Student } from "@/domain/entities/student";
import type { Database } from "@/core/supabase/database.types";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];

export function mapStudent(row: StudentRow): Student {
  return {
    id: row.id,
    userId: row.user_id,
    identification: row.identification,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function mapEnrollment(row: EnrollmentRow): Enrollment {
  return {
    id: row.id,
    userId: row.user_id,
    studentId: row.student_id,
    courseId: row.course_id,
    enrolledAt: row.enrolled_at,
  };
}
