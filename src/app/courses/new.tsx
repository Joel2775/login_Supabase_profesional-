import { AcademicPage } from "@/presentation/academic/academic-ui";
import { CourseForm } from "@/presentation/academic/course-form";

export default function NewCourseScreen() {
  return (
    <AcademicPage
      title="Nuevo curso"
      subtitle="Indica un nombre único y una descripción opcional."
      backHref="/courses"
    >
      <CourseForm />
    </AcademicPage>
  );
}
