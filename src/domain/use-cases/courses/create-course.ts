import type { Course, CreateCourseInput } from "../../entities/course";
import type { CourseRepository } from "../../repositories/course-repository";
import {
  assertNonBlank,
  normalizeOptionalText,
} from "../../validation/academic-validation";

export class CreateCourse {
  constructor(private readonly courseRepository: CourseRepository) {}

  execute(input: CreateCourseInput): Promise<Course> {
    assertNonBlank(input.name, "El nombre del curso");
    return this.courseRepository.create({
      name: input.name.trim(),
      description: normalizeOptionalText(input.description),
    });
  }
}
