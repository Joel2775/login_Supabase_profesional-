import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import {
  AcademicPage,
  Button,
  Card,
  LoadingState,
  Notice,
  uiStyles,
} from "@/presentation/academic/academic-ui";
import { useAcademic } from "@/presentation/academic/academic-provider";
import { useAuth } from "@/presentation/auth/auth-provider";

export default function HomeScreen() {
  const router = useRouter();
  const { isLoading, signOut, user } = useAuth();
  const { dependencies } = useAcademic();
  const [busy, setBusy] = useState(false);
  const [counts, setCounts] = useState<{ students: number; courses: number } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadCounts = useCallback(async () => {
    if (!dependencies) return;
    setMessage(null);
    try {
      const [students, courses] = await Promise.all([
        dependencies.students.getAll.execute(),
        dependencies.courses.getAll.execute(),
      ]);
      setCounts({ students: students.length, courses: courses.length });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron cargar los datos.");
    }
  }, [dependencies]);

  useFocusEffect(useCallback(() => {
    void loadCounts();
  }, [loadCounts]));

  const logout = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await signOut();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not sign out. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <AcademicPage title="Panel académico">
        <LoadingState label="Restaurando sesión…" />
      </AcademicPage>
    );
  }

  return (
    <AcademicPage
      title="Panel académico"
      subtitle={`Sesión iniciada como ${user?.email ?? "cuenta de Google"}`}
    >
      {message ? <Notice message={message} kind="error" /> : null}
      {counts ? (
        <View className={uiStyles.row}>
          <Card className="flex-1">
            <Text className={uiStyles.tiny}>ESTUDIANTES</Text>
            <Text className="text-3xl font-extrabold text-water-700">
              {counts.students}
            </Text>
          </Card>
          <Card className="flex-1">
            <Text className={uiStyles.tiny}>CURSOS</Text>
            <Text className="text-3xl font-extrabold text-water-700">
              {counts.courses}
            </Text>
          </Card>
        </View>
      ) : dependencies ? (
        <LoadingState label="Cargando resumen…" />
      ) : null}
      {!dependencies && !message ? (
        <Notice
          message="Configura la conexión con Supabase para cargar los datos académicos."
          kind="info"
        />
      ) : null}
      <Text className={uiStyles.sectionTitle}>Administración</Text>
      <Card>
        <Text className={uiStyles.cardTitle}>Estudiantes</Text>
        <Text className={uiStyles.body}>Registra, consulta, actualiza y elimina estudiantes.</Text>
        <Button title="Abrir estudiantes" onPress={() => router.push("/students")} />
      </Card>
      <Card>
        <Text className={uiStyles.cardTitle}>Cursos</Text>
        <Text className={uiStyles.body}>Administra tus cursos académicos.</Text>
        <Button title="Abrir cursos" variant="secondary" onPress={() => router.push("/courses")} />
      </Card>
      <Card>
        <Text className={uiStyles.cardTitle}>Inscripciones</Text>
        <Text className={uiStyles.body}>Asigna estudiantes a varios cursos y retira inscripciones.</Text>
        <Button title="Gestionar inscripciones" variant="secondary" onPress={() => router.push("/enrollments")} />
      </Card>
      <Button title="Actualizar resumen" variant="secondary" onPress={() => void loadCounts()} />
      <Button title="Cerrar sesión" variant="danger" onPress={() => void logout()} loading={busy} disabled={busy} />
    </AcademicPage>
  );
}
