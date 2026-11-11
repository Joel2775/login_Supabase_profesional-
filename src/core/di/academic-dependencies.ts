import { createSupabaseClient } from "@/core/supabase/client";
import { SupabaseCourseRepository } from "@/data/academic/supabase-course-repository";
import { SupabaseEnrollmentRepository } from "@/data/academic/supabase-enrollment-repository";
import { SupabaseStudentRepository } from "@/data/academic/supabase-student-repository";
import { CreateCourse } from "@/domain/use-cases/courses/create-course";
import { DeleteCourse } from "@/domain/use-cases/courses/delete-course";
import { GetCourseById } from "@/domain/use-cases/courses/get-course-by-id";
import { GetCourses } from "@/domain/use-cases/courses/get-courses";
import { UpdateCourse } from "@/domain/use-cases/courses/update-course";
import { EnrollStudent } from "@/domain/use-cases/enrollments/enroll-student";
import { GetCourseStudents } from "@/domain/use-cases/enrollments/get-course-students";
import { GetStudentEnrollments } from "@/domain/use-cases/enrollments/get-student-enrollments";
import { GetStudentCourses } from "@/domain/use-cases/enrollments/get-student-courses";
import { RemoveEnrollment } from "@/domain/use-cases/enrollments/remove-enrollment";
import { CreateStudent } from "@/domain/use-cases/students/create-student";
import { DeleteStudent } from "@/domain/use-cases/students/delete-student";
import { GetStudentById } from "@/domain/use-cases/students/get-student-by-id";
import { GetStudents } from "@/domain/use-cases/students/get-students";
import { UpdateStudent } from "@/domain/use-cases/students/update-student";

export function createAcademicDependencies() {
  const supabase = createSupabaseClient();
  const studentRepository = new SupabaseStudentRepository(supabase);
  const courseRepository = new SupabaseCourseRepository(supabase);
  const enrollmentRepository = new SupabaseEnrollmentRepository(supabase);

  return {
    students: {
      create: new CreateStudent(studentRepository),
      getAll: new GetStudents(studentRepository),
      getById: new GetStudentById(studentRepository),
      update: new UpdateStudent(studentRepository),
      delete: new DeleteStudent(studentRepository),
    },
    courses: {
      create: new CreateCourse(courseRepository),
      getAll: new GetCourses(courseRepository),
      getById: new GetCourseById(courseRepository),
      update: new UpdateCourse(courseRepository),
      delete: new DeleteCourse(courseRepository),
    },
    enrollments: {
      enroll: new EnrollStudent(enrollmentRepository),
      getStudentEnrollments: new GetStudentEnrollments(enrollmentRepository),
      getStudentCourses: new GetStudentCourses(enrollmentRepository),
      getCourseStudents: new GetCourseStudents(enrollmentRepository),
      remove: new RemoveEnrollment(enrollmentRepository),
    },
  };
}

export type AcademicDependencies = ReturnType<typeof createAcademicDependencies>;
