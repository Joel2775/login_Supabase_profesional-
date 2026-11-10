import type {
  CreateStudentInput,
  Student,
  UpdateStudentInput,
} from "../entities/student";

export interface StudentRepository {
  create(input: CreateStudentInput): Promise<Student>;
  getAll(): Promise<Student[]>;
  getById(id: string): Promise<Student>;
  update(id: string, input: UpdateStudentInput): Promise<Student>;
  delete(id: string): Promise<void>;
}
