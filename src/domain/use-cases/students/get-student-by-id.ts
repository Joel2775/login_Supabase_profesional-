import type { Student } from "../../entities/student";
import type { StudentRepository } from "../../repositories/student-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class GetStudentById {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(id: string): Promise<Student> {
    assertNonBlank(id, "El identificador del estudiante");
    return this.studentRepository.getById(id);
  }
}
