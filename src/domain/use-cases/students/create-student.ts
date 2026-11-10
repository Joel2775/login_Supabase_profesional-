import type { CreateStudentInput, Student } from "../../entities/student";
import type { StudentRepository } from "../../repositories/student-repository";
import {
  assertNonBlank,
  assertValidEmail,
  normalizeOptionalText,
} from "../../validation/academic-validation";

export class CreateStudent {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(input: CreateStudentInput): Promise<Student> {
    assertNonBlank(input.identification, "La identificación");
    assertNonBlank(input.firstName, "Los nombres");
    assertNonBlank(input.lastName, "Los apellidos");

    const normalizedInput: CreateStudentInput = {
      identification: input.identification.trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: normalizeOptionalText(input.email),
      phone: normalizeOptionalText(input.phone),
    };
    assertValidEmail(normalizedInput.email);

    return this.studentRepository.create(normalizedInput);
  }
}
