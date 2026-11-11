import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import type { Course } from "@/domain/entities/course";
import { useAcademic } from "./academic-provider";
import { Button, Field, Notice } from "./academic-ui";

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const { dependencies, configurationError } = useAcademic();
  const [name, setName] = useState(course?.name ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!dependencies) return;
    setBusy(true);
    setError(null);
    try {
      if (course) {
        await dependencies.courses.update.execute(course.id, {
          name,
          description,
        });
        router.replace({ pathname: "/courses/[id]", params: { id: course.id } });
      } else {
        await dependencies.courses.create.execute({ name, description });
        router.replace("/courses");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el curso.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View>
      {configurationError ? <Notice message={configurationError} kind="error" /> : null}
      {error ? <Notice message={error} kind="error" /> : null}
      <Field
        label="Nombre del curso *"
        value={name}
        onChangeText={setName}
        placeholder="Nombre del curso"
        autoCapitalize="words"
      />
      <Field
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción opcional"
        multiline
      />
      <Button
        title={course ? "Guardar cambios" : "Crear curso"}
        onPress={() => void submit()}
        loading={busy}
        disabled={!dependencies}
      />
    </View>
  );
}
