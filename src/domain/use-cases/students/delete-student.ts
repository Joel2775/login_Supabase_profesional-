import type { StudentRepository } from "../../repositories/student-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class DeleteStudent {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(id: string): Promise<void> {
    assertNonBlank(id, "El identificador del estudiante");
    return this.studentRepository.delete(id);
  }
}
