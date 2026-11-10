import type {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
} from "../entities/course";

export interface CourseRepository {
  create(input: CreateCourseInput): Promise<Course>;
  getAll(): Promise<Course[]>;
  getById(id: string): Promise<Course>;
  update(id: string, input: UpdateCourseInput): Promise<Course>;
  delete(id: string): Promise<void>;
}
