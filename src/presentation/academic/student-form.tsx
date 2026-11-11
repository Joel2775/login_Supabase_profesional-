import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import type { Student } from "@/domain/entities/student";
import { useAcademic } from "./academic-provider";
import { Button, Field, Notice } from "./academic-ui";

export function StudentForm({
  student,
}: {
  student?: Student;
}) {
  const router = useRouter();
  const { dependencies, configurationError } = useAcademic();
  const [identification, setIdentification] = useState(
    student?.identification ?? "",
  );
  const [firstName, setFirstName] = useState(student?.firstName ?? "");
  const [lastName, setLastName] = useState(student?.lastName ?? "");
  const [email, setEmail] = useState(student?.email ?? "");
  const [phone, setPhone] = useState(student?.phone ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!dependencies) return;
    setBusy(true);
    setError(null);
    try {
      if (student) {
        await dependencies.students.update.execute(student.id, {
          identification,
          firstName,
          lastName,
          email,
          phone,
        });
        router.replace({ pathname: "/students/[id]", params: { id: student.id } });
      } else {
        await dependencies.students.create.execute({
          identification,
          firstName,
          lastName,
          email,
          phone,
        });
        router.replace("/students");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el estudiante.",
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
        label="Identificación *"
        value={identification}
        onChangeText={setIdentification}
        placeholder="Número de identificación"
        autoCapitalize="characters"
      />
      <Field
        label="Nombres *"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Nombres del estudiante"
        autoCapitalize="words"
      />
      <Field
        label="Apellidos *"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Apellidos del estudiante"
        autoCapitalize="words"
      />
      <Field
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        placeholder="estudiante@ejemplo.com"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Field
        label="Teléfono"
        value={phone}
        onChangeText={setPhone}
        placeholder="Teléfono (opcional)"
        keyboardType="phone-pad"
      />
      <Button
        title={student ? "Guardar cambios" : "Crear estudiante"}
        onPress={() => void submit()}
        loading={busy}
        disabled={!dependencies}
      />
    </View>
  );
}
