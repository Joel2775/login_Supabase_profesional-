import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text } from "react-native";
import type { Student } from "@/domain/entities/student";
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

export default function StudentsScreen() {
  const router = useRouter();
  const { dependencies, configurationError } = useAcademic();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    if (!dependencies) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setStudents(await dependencies.students.getAll.execute());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los estudiantes.",
      );
    } finally {
      setLoading(false);
    }
  }, [dependencies]);

  useFocusEffect(useCallback(() => {
    void loadStudents();
  }, [loadStudents]));

  return (
    <AcademicPage
      title="Estudiantes"
      subtitle="Administra los registros de tus estudiantes."
      backHref="/home"
      headerAction={
        <Button title="+ Agregar" onPress={() => router.push("/students/new")} />
      }
    >
      {configurationError ? <Notice message={configurationError} kind="error" /> : null}
      {error ? <Notice message={error} kind="error" /> : null}
      <Button title="Actualizar lista" variant="secondary" onPress={() => void loadStudents()} loading={loading} />
      {loading ? (
        <LoadingState label="Cargando estudiantes…" />
      ) : students.length === 0 ? (
        <EmptyState
          title="Aún no hay estudiantes"
          subtitle="Agrega el primer estudiante para empezar a organizar tus cursos."
        />
      ) : (
        <>
          <Text className={uiStyles.sectionTitle}>{students.length} estudiante(s)</Text>
          {students.map((student) => (
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
              <Text className={uiStyles.body}>Identificación: {student.identification}</Text>
              <Text className={uiStyles.tiny}>{student.email ?? "Sin correo registrado"}</Text>
            </Card>
          ))}
        </>
      )}
    </AcademicPage>
  );
}
