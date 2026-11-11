import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Text } from "react-native";
import type { Course } from "@/domain/entities/course";
import type { Enrollment } from "@/domain/entities/enrollment";
import type { Student } from "@/domain/entities/student";
import { useAcademic } from "@/presentation/academic/academic-provider";
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

export default function EnrollmentsScreen() {
  const { studentId: initialStudentId } = useLocalSearchParams<{
    studentId?: string;
  }>();
  const { dependencies } = useAcademic();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialStudentId ?? "",
  );
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadOptions = useCallback(async () => {
    if (!dependencies) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [studentList, courseList] = await Promise.all([
        dependencies.students.getAll.execute(),
        dependencies.courses.getAll.execute(),
      ]);
      setStudents(studentList);
      setCourses(courseList);

      const currentStudentId =
        initialStudentId && studentList.some((item) => item.id === initialStudentId)
          ? initialStudentId
          : selectedStudentId && studentList.some((item) => item.id === selectedStudentId)
            ? selectedStudentId
            : studentList[0]?.id ?? "";
      setSelectedStudentId(currentStudentId);

      if (currentStudentId) {
        setEnrollments(
          await dependencies.enrollments.getStudentEnrollments.execute(
            currentStudentId,
          ),
        );
      } else {
        setEnrollments([]);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar las opciones de inscripción.",
      );
    } finally {
      setLoading(false);
    }
  }, [dependencies, initialStudentId, selectedStudentId]);

  useFocusEffect(useCallback(() => {
    void loadOptions();
  }, [loadOptions]));

  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((enrollment) => enrollment.courseId)),
    [enrollments],
  );
  const courseById = useMemo(
    () => new Map(courses.map((course) => [course.id, course])),
    [courses],
  );

  const selectStudent = async (id: string) => {
    if (!dependencies) return;
    setSelectedStudentId(id);
    setSelectedCourseIds([]);
    setError(null);
    setNotice(null);
    try {
      setEnrollments(
        await dependencies.enrollments.getStudentEnrollments.execute(id),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar sus inscripciones.",
      );
    }
  };

  const toggleCourse = (id: string) => {
    if (enrolledCourseIds.has(id)) return;
    setSelectedCourseIds((current) =>
      current.includes(id)
        ? current.filter((courseId) => courseId !== id)
        : [...current, id],
    );
  };

  const submitEnrollment = async () => {
    if (!dependencies || !selectedStudentId || selectedCourseIds.length === 0) {
      setError("Selecciona un estudiante y al menos un curso.");
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const created = await dependencies.enrollments.enroll.execute(
        selectedStudentId,
        selectedCourseIds,
      );
      setSelectedCourseIds([]);
      await loadOptions();
      setNotice(
        created.length > 0
          ? `Se crearon ${created.length} inscripción(es).`
          : "Los cursos seleccionados ya estaban inscritos.",
      );
    } catch (enrollError) {
      setError(
        enrollError instanceof Error
          ? enrollError.message
          : "No se pudo completar la inscripción.",
      );
    } finally {
      setBusy(false);
    }
  };

  const removeEnrollment = async (enrollment: Enrollment) => {
    if (!dependencies) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await dependencies.enrollments.remove.execute(enrollment.id);
      setEnrollments((current) =>
        current.filter((item) => item.id !== enrollment.id),
      );
      setNotice("Se retiró la inscripción. El estudiante y el curso se conservaron.");
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "No se pudo retirar la inscripción.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AcademicPage
      title="Inscripciones"
      subtitle="Inscribe estudiantes en uno o varios cursos y administra sus matrículas."
      backHref="/home"
    >
      {error ? <Notice message={error} kind="error" /> : null}
      {notice ? <Notice message={notice} kind="success" /> : null}
      <Button
        title="Actualizar datos"
        variant="secondary"
        onPress={() => void loadOptions()}
        loading={loading}
      />
      {loading ? (
        <LoadingState label="Cargando estudiantes y cursos…" />
      ) : students.length === 0 ? (
        <EmptyState
          title="Primero agrega estudiantes"
          subtitle="Necesitas al menos un estudiante para crear inscripciones."
        />
      ) : courses.length === 0 ? (
        <EmptyState
          title="Primero agrega cursos"
          subtitle="Necesitas al menos un curso para crear inscripciones."
        />
      ) : (
        <>
          <Text className={uiStyles.sectionTitle}>1. Selecciona un estudiante</Text>
          {students.map((student) => (
            <Card
              key={student.id}
              onPress={() => void selectStudent(student.id)}
            >
              <Text className={uiStyles.cardTitle}>
                {selectedStudentId === student.id ? "● " : "○ "}
                {student.firstName} {student.lastName}
              </Text>
              <Text className={uiStyles.tiny}>{student.identification}</Text>
            </Card>
          ))}

          <Text className={uiStyles.sectionTitle}>2. Selecciona uno o varios cursos</Text>
          {courses.map((course) => {
            const alreadyEnrolled = enrolledCourseIds.has(course.id);
            const selected = selectedCourseIds.includes(course.id);
            return (
              <Card
                key={course.id}
                onPress={() => toggleCourse(course.id)}
              >
                <Text className={uiStyles.cardTitle}>
                  {alreadyEnrolled ? "✓ " : selected ? "☑ " : "□ "}
                  {course.name}
                </Text>
                <Text className={uiStyles.tiny}>
                  {alreadyEnrolled
                    ? "Ya está inscrito"
                    : course.description ?? "Toca para seleccionar"}
                </Text>
              </Card>
            );
          })}
          <Button
            title="Inscribir en cursos seleccionados"
            onPress={() => void submitEnrollment()}
            loading={busy}
            disabled={!selectedStudentId || selectedCourseIds.length === 0}
          />

          <Text className={uiStyles.sectionTitle}>Inscripciones actuales</Text>
          {enrollments.length === 0 ? (
            <EmptyState
              title="Sin inscripciones"
              subtitle="El estudiante seleccionado todavía no tiene cursos asignados."
            />
          ) : (
            enrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <Text className={uiStyles.cardTitle}>
                  {courseById.get(enrollment.courseId)?.name ??
                    "Curso no disponible"}
                </Text>
                <Text className={uiStyles.tiny}>
                  Inscrito: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </Text>
                <Button
                  title="Retirar inscripción"
                  variant="danger"
                  disabled={busy}
                  onPress={() =>
                    confirmDestructiveAction(
                      "Retirar inscripción",
                      "Se quitará esta inscripción. El estudiante y el curso se conservarán.",
                      () => void removeEnrollment(enrollment),
                    )
                  }
                />
              </Card>
            ))
          )}
        </>
      )}
    </AcademicPage>
  );
}
