import type { Student, UpdateStudentInput } from "../../entities/student";
import type { StudentRepository } from "../../repositories/student-repository";
import {
  assertHasChanges,
  assertNonBlank,
  assertValidEmail,
  normalizeOptionalText,
} from "../../validation/academic-validation";

export class UpdateStudent {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(id: string, input: UpdateStudentInput): Promise<Student> {
    assertNonBlank(id, "El identificador del estudiante");
    assertHasChanges(input, "el estudiante");

    const normalizedInput: UpdateStudentInput = { ...input };
    if (input.identification !== undefined) {
      assertNonBlank(input.identification, "La identificación");
      normalizedInput.identification = input.identification.trim();
    }
    if (input.firstName !== undefined) {
      assertNonBlank(input.firstName, "Los nombres");
      normalizedInput.firstName = input.firstName.trim();
    }
    if (input.lastName !== undefined) {
      assertNonBlank(input.lastName, "Los apellidos");
      normalizedInput.lastName = input.lastName.trim();
    }
    if (input.email !== undefined) {
      normalizedInput.email = normalizeOptionalText(input.email);
      assertValidEmail(normalizedInput.email);
    }
    if (input.phone !== undefined) {
      normalizedInput.phone = normalizeOptionalText(input.phone);
    }

    return this.studentRepository.update(id, normalizedInput);
  }
}
