import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import type { Course } from "@/domain/entities/course";
import {
  AcademicPage,
  Button,
  Card,
  EmptyState,
  LoadingState,
  Notice,
  uiStyles,
} from "@/presentation/academic/academic-ui";
import { useAcademic } from "@/presentation/academic/academic-provider";

export default function CoursesScreen() {
  const router = useRouter();
  const { dependencies } = useAcademic();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    if (!dependencies) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCourses(await dependencies.courses.getAll.execute());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los cursos.",
      );
    } finally {
      setLoading(false);
    }
  }, [dependencies]);

  useFocusEffect(useCallback(() => {
    void loadCourses();
  }, [loadCourses]));

  return (
    <AcademicPage
      title="Cursos"
      subtitle="Crea cursos y revisa sus estudiantes inscritos."
      backHref="/home"
      headerAction={
        <Button title="+ Agregar" onPress={() => router.push("/courses/new")} />
      }
    >
      {error ? <Notice message={error} kind="error" /> : null}
      <Button
        title="Actualizar lista"
        variant="secondary"
        onPress={() => void loadCourses()}
        loading={loading}
      />
      {loading ? (
        <LoadingState label="Cargando cursos…" />
      ) : courses.length === 0 ? (
        <EmptyState
          title="Aún no hay cursos"
          subtitle="Agrega el primer curso para empezar a inscribir estudiantes."
        />
      ) : (
        <>
          <Text className={uiStyles.sectionTitle}>{courses.length} curso(s)</Text>
          {courses.map((course) => (
            <Card
              key={course.id}
              onPress={() =>
                router.push({
                  pathname: "/courses/[id]",
                  params: { id: course.id },
                })
              }
            >
              <Text className={uiStyles.cardTitle}>{course.name}</Text>
              <Text className={uiStyles.body}>
                {course.description ?? "Sin descripción"}
              </Text>
            </Card>
          ))}
        </>
      )}
    </AcademicPage>
  );
}
