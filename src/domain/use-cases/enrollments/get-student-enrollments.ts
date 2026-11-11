import type { Enrollment } from "../../entities/enrollment";
import type { EnrollmentRepository } from "../../repositories/enrollment-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class GetStudentEnrollments {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  execute(studentId: string): Promise<Enrollment[]> {
    assertNonBlank(studentId, "El identificador del estudiante");
    return this.enrollmentRepository.getStudentEnrollments(studentId);
  }
}
