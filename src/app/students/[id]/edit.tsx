import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import type { Student } from "@/domain/entities/student";
import { useAcademic } from "@/presentation/academic/academic-provider";
import { AcademicPage, LoadingState, Notice } from "@/presentation/academic/academic-ui";
import { StudentForm } from "@/presentation/academic/student-form";

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dependencies } = useAcademic();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudent = useCallback(async () => {
    if (!dependencies || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setStudent(await dependencies.students.getById.execute(id));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el estudiante.");
    } finally {
      setLoading(false);
    }
  }, [dependencies, id]);

  useFocusEffect(useCallback(() => {
    void loadStudent();
  }, [loadStudent]));

  return (
    <AcademicPage title="Editar estudiante" subtitle="Actualiza sus datos." backHref="/students">
      {error ? <Notice message={error} kind="error" /> : null}
      {loading ? <LoadingState /> : student ? <StudentForm student={student} /> : null}
    </AcademicPage>
  );
}
