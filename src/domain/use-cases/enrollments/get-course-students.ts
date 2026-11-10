import type { Student } from "../../entities/student";
import type { EnrollmentRepository } from "../../repositories/enrollment-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class GetCourseStudents {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  execute(courseId: string): Promise<Student[]> {
    assertNonBlank(courseId, "El identificador del curso");
    return this.enrollmentRepository.getCourseStudents(courseId);
  }
}
