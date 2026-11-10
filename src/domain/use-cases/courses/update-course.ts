import type { Course, UpdateCourseInput } from "../../entities/course";
import type { CourseRepository } from "../../repositories/course-repository";
import {
  assertHasChanges,
  assertNonBlank,
  normalizeOptionalText,
} from "../../validation/academic-validation";

export class UpdateCourse {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(id: string, input: UpdateCourseInput): Promise<Course> {
    assertNonBlank(id, "El identificador del curso");
    assertHasChanges(input, "el curso");

    const normalizedInput: UpdateCourseInput = { ...input };
    if (input.name !== undefined) {
      assertNonBlank(input.name, "El nombre del curso");
      normalizedInput.name = input.name.trim();
    }
    if (input.description !== undefined) {
      normalizedInput.description = normalizeOptionalText(input.description);
    }

    return this.courseRepository.update(id, normalizedInput);
  }
}
