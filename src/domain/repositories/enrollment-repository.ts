import type { Course } from "../entities/course";
import type { Enrollment } from "../entities/enrollment";
import type { Student } from "../entities/student";

export interface EnrollmentRepository {
  enroll(studentId: string, courseIds: string[]): Promise<Enrollment[]>;
  getStudentCourses(studentId: string): Promise<Course[]>;
  getCourseStudents(courseId: string): Promise<Student[]>;
  remove(id: string): Promise<void>;
}
