import type { Course } from "../../entities/course";
import type { EnrollmentRepository } from "../../repositories/enrollment-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class GetStudentCourses {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  execute(studentId: string): Promise<Course[]> {
    assertNonBlank(studentId, "El identificador del estudiante");
    return this.enrollmentRepository.getStudentCourses(studentId);
  }
}
