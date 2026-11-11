import { AcademicPage } from "@/presentation/academic/academic-ui";
import { StudentForm } from "@/presentation/academic/student-form";

export default function NewStudentScreen() {
  return (
    <AcademicPage
      title="Nuevo estudiante"
      subtitle="Completa los datos obligatorios para registrar un estudiante."
      backHref="/students"
    >
      <StudentForm />
    </AcademicPage>
  );
}
