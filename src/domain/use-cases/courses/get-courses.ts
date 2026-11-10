import type { Course } from "../../entities/course";
import type { CourseRepository } from "../../repositories/course-repository";

export class GetCourses {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(): Promise<Course[]> {
    return this.courseRepository.getAll();
  }
}
