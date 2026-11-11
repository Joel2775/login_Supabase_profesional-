import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import type { Course } from "@/domain/entities/course";
import type { Student } from "@/domain/entities/student";
import {
  AcademicPage,
  Button,
  Card,
  EmptyState,
  LoadingState,
  Notice,
  confirmDestructiveAction,
  uiStyles,
} from "@/presentation/academic/academic-ui";
import { useAcademic } from "@/presentation/academic/academic-provider";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { dependencies } = useAcademic();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!dependencies || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [courseRecord, enrolledStudents] = await Promise.all([
        dependencies.courses.getById.execute(id),
        dependencies.enrollments.getCourseStudents.execute(id),
      ]);
      setCourse(courseRecord);
      setStudents(enrolledStudents);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "No se pudo cargar el curso.",
      );
    } finally {
      setLoading(false);
    }
  }, [dependencies, id]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  const deleteCourse = async () => {
    if (!dependencies || !course) return;
    setBusy(true);
    setError(null);
    try {
      await dependencies.courses.delete.execute(course.id);
      router.replace("/courses");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "No se pudo eliminar.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AcademicPage
      title="Detalle del curso"
      subtitle="Consulta y administra el curso y sus inscripciones."
      backHref="/courses"
    >
      {error ? <Notice message={error} kind="error" /> : null}
      {loading ? (
        <LoadingState label="Cargando curso…" />
      ) : course ? (
        <>
          <Card>
            <Text className={uiStyles.cardTitle}>{course.name}</Text>
            <Text className={uiStyles.body}>{course.description ?? "Sin descripción"}</Text>
          </Card>
          <Button
            title="Editar curso"
            onPress={() =>
              router.push({
                pathname: "/courses/[id]/edit",
                params: { id: course.id },
              })
            }
          />
          <Button
            title="Gestionar inscripciones"
            variant="secondary"
            onPress={() => router.push("/enrollments")}
          />
          {busy ? <LoadingState label="Eliminando curso…" /> : null}
          <Button
            title="Eliminar curso"
            variant="danger"
            disabled={busy}
            onPress={() =>
              confirmDestructiveAction(
                "Eliminar curso",
                "Se eliminará el curso y sus inscripciones. Los estudiantes se conservarán.",
                () => void deleteCourse(),
              )
            }
          />
          <Text className={uiStyles.sectionTitle}>Estudiantes inscritos</Text>
          {students.length === 0 ? (
            <EmptyState
              title="Sin estudiantes"
              subtitle="Todavía no hay estudiantes inscritos en este curso."
            />
          ) : (
            students.map((student) => (
              <Card
                key={student.id}
                onPress={() =>
                  router.push({
                    pathname: "/students/[id]",
                    params: { id: student.id },
                  })
                }
              >
                <Text className={uiStyles.cardTitle}>
                  {student.firstName} {student.lastName}
                </Text>
                <Text className={uiStyles.body}>{student.identification}</Text>
              </Card>
            ))
          )}
        </>
      ) : (
        <EmptyState title="Curso no disponible" subtitle="No se encontró el curso solicitado." />
      )}
    </AcademicPage>
  );
}
