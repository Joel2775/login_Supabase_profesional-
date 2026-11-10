import type { EnrollmentRepository } from "../../repositories/enrollment-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class RemoveEnrollment {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  execute(id: string): Promise<void> {
    assertNonBlank(id, "El identificador de la inscripción");
    return this.enrollmentRepository.remove(id);
  }
}
