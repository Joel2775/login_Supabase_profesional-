import type { CourseRepository } from "../../repositories/course-repository";
import { assertNonBlank } from "../../validation/academic-validation";

export class DeleteCourse {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(id: string): Promise<void> {
    assertNonBlank(id, "El identificador del curso");
    return this.courseRepository.delete(id);
  }
}
