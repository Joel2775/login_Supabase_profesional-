import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import type { Course } from "@/domain/entities/course";
import { useAcademic } from "@/presentation/academic/academic-provider";
import {
  AcademicPage,
  LoadingState,
  Notice,
} from "@/presentation/academic/academic-ui";
import { CourseForm } from "@/presentation/academic/course-form";

export default function EditCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dependencies } = useAcademic();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (!dependencies || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCourse(await dependencies.courses.getById.execute(id));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el curso.");
    } finally {
      setLoading(false);
    }
  }, [dependencies, id]);

  useFocusEffect(useCallback(() => {
    void loadCourse();
  }, [loadCourse]));

  return (
    <AcademicPage title="Editar curso" subtitle="Actualiza sus datos." backHref="/courses">
      {error ? <Notice message={error} kind="error" /> : null}
      {loading ? <LoadingState /> : course ? <CourseForm course={course} /> : null}
    </AcademicPage>
  );
}
