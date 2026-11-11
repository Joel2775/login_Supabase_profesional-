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

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { dependencies } = useAcademic();
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
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
      const [studentRecord, enrolledCourses] = await Promise.all([
        dependencies.students.getById.execute(id),
        dependencies.enrollments.getStudentCourses.execute(id),
      ]);
      setStudent(studentRecord);
      setCourses(enrolledCourses);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el estudiante.");
    } finally {
      setLoading(false);
    }
  }, [dependencies, id]);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  const deleteStudent = async () => {
    if (!dependencies || !student) return;
    setBusy(true);
    setError(null);
    try {
      await dependencies.students.delete.execute(student.id);
      router.replace("/students");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AcademicPage
      title="Detalle del estudiante"
      subtitle="Consulta y administra su información académica."
      backHref="/students"
    >
      {error ? <Notice message={error} kind="error" /> : null}
      {loading ? (
        <LoadingState label="Cargando estudiante…" />
      ) : student ? (
        <>
          <Card>
            <Text className={uiStyles.cardTitle}>{student.firstName} {student.lastName}</Text>
            <Text className={uiStyles.body}>Identificación: {student.identification}</Text>
            <Text className={uiStyles.body}>Correo: {student.email ?? "No registrado"}</Text>
            <Text className={uiStyles.body}>Teléfono: {student.phone ?? "No registrado"}</Text>
          </Card>
          <Button
            title="Editar estudiante"
            onPress={() =>
              router.push({
                pathname: "/students/[id]/edit",
                params: { id: student.id },
              })
            }
          />
          <Button
            title="Gestionar cursos"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: "/enrollments",
                params: { studentId: student.id },
              })
            }
          />
          {busy ? <LoadingState label="Eliminando estudiante…" /> : null}
          <Button
            title="Eliminar estudiante"
            variant="danger"
            disabled={busy}
            onPress={() =>
              confirmDestructiveAction(
                "Eliminar estudiante",
                "Se eliminará el estudiante y también sus inscripciones. Los cursos se conservarán.",
                () => void deleteStudent(),
              )
            }
          />
          <Text className={uiStyles.sectionTitle}>Cursos inscritos</Text>
          {courses.length === 0 ? (
            <EmptyState title="Sin cursos" subtitle="Este estudiante todavía no está inscrito." />
          ) : (
            courses.map((course) => (
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
              </Card>
            ))
          )}
        </>
      ) : (
        <EmptyState title="Estudiante no disponible" subtitle="No se encontró el registro solicitado." />
      )}
    </AcademicPage>
  );
}
