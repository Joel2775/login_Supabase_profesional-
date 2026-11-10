import type { Course } from "../../entities/course";
import type { CourseRepository } from "../../repositories/course-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class GetCourseById {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(id: string): Promise<Course> {
    assertNonBlank(id, "El identificador del curso");
    return this.courseRepository.getById(id);
  }
}
