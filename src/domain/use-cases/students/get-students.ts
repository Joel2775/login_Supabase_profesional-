import type { Student } from "../../entities/student";
import type { StudentRepository } from "../../repositories/student-repository";

export class GetStudents {
  constructor(private readonly studentRepository: StudentRepository) {}

  execute(): Promise<Student[]> {
    return this.studentRepository.getAll();
  }
}
