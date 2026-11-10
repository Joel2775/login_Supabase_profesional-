import type { Enrollment } from "../../entities/enrollment";
import type { EnrollmentRepository } from "../../repositories/enrollment-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class EnrollStudent {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  execute(studentId: string, courseIds: string[]): Promise<Enrollment[]> {
    assertNonBlank(studentId, "El identificador del estudiante");
    if (courseIds.length === 0) {
      throw new Error("Debes seleccionar al menos un curso.");
    }

    for (const courseId of courseIds) {
      assertNonBlank(courseId, "El identificador del curso");
    }
    if (new Set(courseIds).size !== courseIds.length) {
      throw new Error("La lista contiene cursos duplicados.");
    }

    return this.enrollmentRepository.enroll(studentId, courseIds);
  }
}
