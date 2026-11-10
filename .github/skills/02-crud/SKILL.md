---
name: 02-crud
description: Implementa un sistema de gestión académica con CRUD de estudiantes, cursos e inscripciones utilizando Supabase PostgreSQL, API REST, Supabase SDK, funciones RPC, Clean Architecture y Expo React Native. Incluye scripts SQL versionados, seguridad RLS y actualización obligatoria de memory.md.
---

# SKILL: PARTE 2 - SISTEMA DE ESTUDIANTES, CURSOS E INSCRIPCIONES CON SUPABASE

## 1. OBJETIVO GENERAL

Desarrollar un sistema de gestión académica que permita administrar estudiantes, cursos e inscripciones mediante una aplicación móvil.

La aplicación permitirá:

- Registrar estudiantes.
- Consultar estudiantes.
- Editar estudiantes.
- Eliminar estudiantes.
- Crear cursos.
- Consultar cursos.
- Editar cursos.
- Eliminar cursos.
- Inscribir estudiantes en varios cursos.
- Consultar los cursos de cada estudiante.
- Retirar estudiantes de cursos sin eliminar sus registros.

La información se almacenará en Supabase PostgreSQL.

La aplicación consumirá los servicios de Supabase mediante su API REST utilizando `@supabase/supabase-js`.

No desarrollar un backend adicional con Node.js o Express.

## 2. INSTRUCCIONES OBLIGATORIAS ANTES DE COMENZAR

Antes de modificar cualquier archivo:

1. Leer `AGENTS.md` ubicado en la raíz del proyecto.
2. Leer `memory.md` ubicado en la raíz del proyecto.
3. Revisar la estructura real del proyecto.
4. Revisar la implementación actual de Supabase.
5. Revisar cómo se obtiene la sesión del usuario autenticado.
6. Revisar las dependencias instaladas.
7. Comprobar qué partes de la Parte 1 están implementadas.
8. Identificar las convenciones de nombres y organización existentes.

No inventar funcionalidades implementadas.

No reemplazar archivos completos sin necesidad.

No modificar el sistema de autenticación de la Parte 1 si no es necesario.

No cambiar Expo SDK 57 ni actualizar dependencias sin autorización.

## 3. ARQUITECTURA OBLIGATORIA

Utilizar Clean Architecture respetando la organización existente.

### Presentation

Responsabilidades:

- Pantallas.
- Formularios.
- Componentes visuales.
- Hooks.
- Estados de carga.
- Estados de error.
- Navegación.

No realizar consultas directas a Supabase desde las pantallas.

### Domain

Responsabilidades:

- Entidades.
- Interfaces de repositorios.
- Casos de uso.
- Reglas de negocio.
- Tipos independientes de Supabase.

No importar dependencias de React Native ni Supabase.

### Data

Responsabilidades:

- Implementaciones de repositorios.
- Acceso a Supabase.
- Consultas mediante Supabase SDK.
- Invocación de funciones RPC.
- Mapeadores.
- Manejo de respuestas y errores.

Todas las llamadas a Supabase deben concentrarse en esta capa.

### Core

Responsabilidades:

- Cliente Supabase existente.
- Configuración.
- Variables de entorno.
- Servicios fundamentales.

No duplicar la inicialización de Supabase.

### Shared

Responsabilidades:

- Componentes reutilizables.
- Utilidades.
- Tipos compartidos.
- Funciones comunes.

## 4. ESTRATEGIA DE BACKEND Y ACCESO A DATOS

Utilizar Supabase como backend administrado.

No crear un servidor propio.

La comunicación con Supabase debe realizarse mediante:

1. Supabase SDK (`@supabase/supabase-js`).
2. API REST generada automáticamente por Supabase.
3. Funciones PostgreSQL RPC para operaciones complejas.

### 4.1. Operaciones CRUD sencillas

Utilizar los métodos del SDK:

- `.select()` para consultar.
- `.insert()` para registrar.
- `.update()` para modificar.
- `.delete()` para eliminar.
- `.eq()` y otros filtros para seleccionar registros.

Ejemplo conceptual:

```typescript
const { data, error } = await supabase
  .from("students")
  .select("*");
```

No escribir SQL directamente dentro de los archivos TypeScript.

### 4.2. Operaciones complejas

Utilizar funciones PostgreSQL RPC cuando una operación requiera:

- Ejecutar varias operaciones relacionadas.
- Garantizar atomicidad.
- Realizar validaciones complejas en el servidor.
- Gestionar varias inscripciones en una transacción.

Invocar las funciones desde el SDK:

```typescript
const { data, error } = await supabase.rpc(
  "nombre_funcion",
  {
    parametro: "valor"
  }
);
```

No utilizar RPC innecesariamente para operaciones CRUD sencillas.

### 4.3. Seguridad

- Activar RLS en todas las tablas.
- Utilizar `auth.uid()` para identificar al usuario autenticado.
- No colocar claves `service_role` en React Native.
- No confiar únicamente en validaciones del frontend.
- Validar las operaciones importantes en PostgreSQL.
- Las funciones RPC deben ejecutarse con permisos mínimos.
- Evitar funciones `SECURITY DEFINER` si no son necesarias.
- Si se utiliza `SECURITY DEFINER`, validar expresamente el usuario y establecer un `search_path` seguro.

## 5. ORGANIZACIÓN DE LOS SCRIPTS SQL

Crear una carpeta para mantener los scripts de base de datos:

```text
supabase/
└── migrations/
    ├── 001_create_students.sql
    ├── 002_create_courses.sql
    ├── 003_create_enrollments.sql
    ├── 004_configure_rls.sql
    └── 005_create_rpc_functions.sql
```

Los scripts deben contener:

- Creación de tablas.
- Claves primarias.
- Claves foráneas.
- Restricciones.
- Índices.
- Políticas RLS.
- Funciones RPC.

Ejecutar los scripts desde Supabase SQL Editor o mediante el sistema de migraciones de Supabase CLI si el proyecto ya lo utiliza.

No afirmar que una migración se ejecutó correctamente sin verificarlo.

Mantener los scripts versionados y ordenados.

Evitar duplicar instrucciones SQL innecesariamente.

## 6. MODELO DE BASE DE DATOS

Crear tres tablas principales.

### 6.1. Tabla students

Almacena los estudiantes.

Campos:

- id: UUID, clave primaria.
- user_id: UUID, propietario del registro, relacionado con auth.users.
- identification: identificación del estudiante.
- first_name: nombres.
- last_name: apellidos.
- email: correo electrónico.
- phone: teléfono, opcional.
- created_at: fecha de creación.

Restricciones:

- Identificación obligatoria.
- Nombres obligatorios.
- Apellidos obligatorios.
- Correo válido cuando se proporcione.
- Identificación única por usuario.

### 6.2. Tabla courses

Almacena los cursos.

Campos:

- id: UUID, clave primaria.
- user_id: UUID, propietario del registro.
- name: nombre del curso.
- description: descripción del curso, opcional.
- created_at: fecha de creación.

Restricciones:

- Nombre obligatorio.
- Evitar cursos duplicados por usuario cuando corresponda.

### 6.3. Tabla enrollments

Relaciona estudiantes con cursos.

Campos:

- id: UUID, clave primaria.
- user_id: UUID, propietario del registro.
- student_id: UUID, referencia a students.
- course_id: UUID, referencia a courses.
- enrolled_at: fecha de inscripción.

Restricciones:

- student_id obligatorio.
- course_id obligatorio.
- No permitir inscripciones duplicadas.
- Crear una restricción UNIQUE para student_id y course_id.
- Garantizar que estudiante y curso pertenezcan al mismo usuario.

### 6.4. Relaciones

La relación entre estudiantes y cursos es muchos a muchos.

Ejemplo:

Estudiante 1:
- Matemáticas.
- Programación.
- Base de datos.

Estudiante 2:
- Matemáticas.
- Desarrollo web.

Estudiante 3:
- Programación.
- Base de datos.

La tabla enrollments representa las inscripciones.

### 6.5. Eliminaciones

Configurar las claves foráneas correctamente:

- Eliminar estudiante: eliminar sus inscripciones automáticamente.
- Eliminar curso: eliminar sus inscripciones automáticamente.
- Eliminar inscripción: conservar estudiante y curso.

Utilizar `ON DELETE CASCADE` en las relaciones correspondientes.

Asegurar que las claves foráneas y las restricciones también impidan relaciones entre registros de diferentes propietarios.

## 7. SEGURIDAD RLS

Activar Row Level Security en las tres tablas.

Cada usuario autenticado debe acceder únicamente a sus registros.

Crear políticas para:

- SELECT.
- INSERT.
- UPDATE.
- DELETE.

Utilizar `auth.uid()` para validar `user_id`.

En las políticas de actualización utilizar `USING` y `WITH CHECK` cuando corresponda.

Para las inscripciones, comprobar también que el estudiante y el curso pertenezcan al mismo usuario autenticado.

No desactivar RLS.

No utilizar la clave privada `service_role` desde la aplicación.

## 8. FUNCIONALIDADES DEL SISTEMA

### 8.1. Gestión de estudiantes

Implementar:

- Registrar estudiante.
- Listar estudiantes.
- Consultar estudiante por ID.
- Editar estudiante.
- Eliminar estudiante.
- Consultar los cursos inscritos.

Al eliminar un estudiante:

1. Solicitar confirmación.
2. Informar que también se eliminarán sus inscripciones.
3. Ejecutar la eliminación.
4. Actualizar la interfaz.

No eliminar los cursos.

### 8.2. Gestión de cursos

Implementar:

- Crear curso.
- Listar cursos.
- Consultar curso por ID.
- Editar curso.
- Eliminar curso.
- Consultar estudiantes inscritos.

Al eliminar un curso:

1. Solicitar confirmación.
2. Informar que también se eliminarán las inscripciones relacionadas.
3. Ejecutar la eliminación.
4. Actualizar la interfaz.

No eliminar los estudiantes.

### 8.3. Gestión de inscripciones

Implementar:

- Inscribir estudiante en uno o varios cursos.
- Consultar los cursos de un estudiante.
- Agregar cursos a un estudiante existente.
- Retirar una inscripción.
- Consultar los estudiantes de un curso.
- Evitar inscripciones duplicadas.

Al retirar una inscripción, conservar el estudiante y el curso.

## 9. CASOS DE USO

Crear los siguientes casos de uso, adaptando sus nombres a las convenciones del proyecto.

### Estudiantes

- CreateStudent.
- GetStudents.
- GetStudentById.
- UpdateStudent.
- DeleteStudent.

### Cursos

- CreateCourse.
- GetCourses.
- GetCourseById.
- UpdateCourse.
- DeleteCourse.

### Inscripciones

- EnrollStudent.
- GetStudentCourses.
- GetCourseStudents.
- RemoveEnrollment.

Los casos de uso no deben depender directamente de Supabase.

Deben utilizar las interfaces definidas en Domain.

## 10. REPOSITORIOS

Crear interfaces en Domain y sus implementaciones en Data.

Ejemplos:

StudentRepository:
- create.
- getAll.
- getById.
- update.
- delete.

CourseRepository:
- create.
- getAll.
- getById.
- update.
- delete.

EnrollmentRepository:
- enroll.
- getStudentCourses.
- getCourseStudents.
- remove.

Las implementaciones deben utilizar Supabase SDK o RPC según la complejidad de cada operación.

No escribir consultas SQL en los repositorios TypeScript.

No devolver estructuras internas de Supabase directamente a Presentation.

Mapear los resultados a entidades y tipos de Domain.

## 11. INTERFAZ DE USUARIO

Crear una interfaz móvil moderna, clara e intuitiva.

Utilizar la configuración visual existente del proyecto.

Si Uniwind ya está implementado, respetarlo.

Crear las pantallas necesarias:

1. Panel principal.
2. Lista de estudiantes.
3. Registro de estudiante.
4. Edición de estudiante.
5. Detalle del estudiante.
6. Lista de cursos.
7. Registro de curso.
8. Edición de curso.
9. Detalle del curso.
10. Gestión de inscripciones.

Incluir:

- Formularios con validaciones.
- Indicadores de carga.
- Mensajes de éxito.
- Mensajes de error.
- Confirmaciones antes de eliminar.
- Estados vacíos.
- Actualización de datos después de las operaciones.

No agregar funcionalidades ajenas al objetivo del deber.

## 12. VALIDACIONES

Implementar validaciones en Presentation y Domain cuando corresponda.

Validar:

- Nombres obligatorios.
- Apellidos obligatorios.
- Identificación obligatoria.
- Correo electrónico válido.
- Nombre del curso obligatorio.
- Identificación duplicada por usuario.
- Inscripciones duplicadas.
- Existencia de estudiante.
- Existencia de curso.
- Propiedad de estudiante y curso.
- Sesión autenticada.

Las validaciones críticas deben reforzarse en PostgreSQL.

Mostrar mensajes comprensibles.

## 13. ACTUALIZACIÓN OBLIGATORIA DE memory.md

Al terminar cada bloque, actualizar `memory.md` en la raíz del proyecto.

Registrar únicamente avances reales.

Actualizar:

- Estado de la Parte 2.
- Tablas creadas.
- Relaciones implementadas.
- Restricciones.
- Políticas RLS.
- Funciones RPC creadas.
- Scripts SQL generados y ejecutados.
- Repositorios implementados.
- Casos de uso implementados.
- Pantallas implementadas.
- Dependencias instaladas.
- Pruebas realizadas.
- Errores pendientes.
- Siguiente paso.

Diferenciar claramente entre:

- Pendiente.
- En desarrollo.
- Implementado en código.
- Ejecutado en Supabase.
- Probado correctamente.

No marcar una operación como terminada si solamente se creó su interfaz.

## 14. DESARROLLO POR BLOQUES

Trabajar obligatoriamente en el siguiente orden.

### BLOQUE 1. Análisis y diseño

- Leer AGENTS.md y memory.md.
- Revisar proyecto.
- Revisar autenticación.
- Diseñar entidades y relaciones.
- Definir estrategia de acceso a datos.
- Proponer scripts SQL.
- Actualizar memory.md.

No modificar código ni base de datos todavía.

### BLOQUE 2. Base de datos

- Crear los scripts SQL.
- Crear las tres tablas.
- Crear restricciones.
- Crear relaciones.
- Crear índices necesarios.
- Configurar RLS.
- Ejecutar los scripts en Supabase.
- Verificar las tablas y políticas.
- Actualizar memory.md.

### BLOQUE 3. Domain

- Crear entidades.
- Crear interfaces.
- Crear casos de uso.
- Definir validaciones.
- Actualizar memory.md.

### BLOQUE 4. Data

- Implementar repositorios.
- Conectar repositorios con Supabase.
- Implementar consultas REST mediante SDK.
- Implementar mapeadores.
- Manejar errores.
- Actualizar memory.md.

### BLOQUE 5. CRUD de estudiantes

- Crear estudiante.
- Consultar estudiantes.
- Consultar por ID.
- Editar estudiante.
- Eliminar estudiante.
- Probar operaciones.
- Actualizar memory.md.

### BLOQUE 6. CRUD de cursos

- Crear curso.
- Consultar cursos.
- Editar curso.
- Eliminar curso.
- Consultar estudiantes inscritos.
- Probar operaciones.
- Actualizar memory.md.

### BLOQUE 7. Inscripciones

- Inscribir estudiantes.
- Inscribir en varios cursos.
- Consultar cursos de estudiantes.
- Retirar inscripciones.
- Evitar duplicados.
- Crear RPC cuando se necesite atomicidad.
- Probar operaciones.
- Actualizar memory.md.

### BLOQUE 8. Interfaz

- Crear pantallas.
- Crear formularios.
- Integrar casos de uso.
- Implementar estados de carga.
- Implementar confirmaciones.
- Mejorar experiencia visual.
- Actualizar memory.md.

### BLOQUE 9. Pruebas finales

Verificar:

- Crear estudiante.
- Consultar estudiante.
- Editar estudiante.
- Eliminar estudiante y sus inscripciones.
- Crear curso.
- Editar curso.
- Eliminar curso y sus inscripciones.
- Inscribir estudiante en varios cursos.
- Evitar duplicados.
- Retirar una inscripción sin eliminar estudiante ni curso.
- Aislamiento de datos entre usuarios.
- Persistencia de información en Supabase.

Actualizar memory.md con el resultado real.

## 15. RESTRICCIONES IMPORTANTES

- No modificar innecesariamente la Parte 1.
- No cambiar Expo SDK 57.
- No instalar dependencias innecesarias.
- No desarrollar un backend Node.js o Express.
- No escribir SQL dentro del código de React Native.
- No colocar consultas directas a Supabase en las pantallas.
- No desactivar RLS.
- No utilizar service_role en el frontend.
- No inventar resultados de pruebas.
- No crear tablas innecesarias.
- No duplicar la configuración de Supabase.
- No avanzar al siguiente bloque sin autorización del usuario.

## 16. RESULTADO FINAL ESPERADO

Entregar un sistema móvil de gestión académica con:

- CRUD completo de estudiantes.
- CRUD completo de cursos.
- Inscripciones de estudiantes en múltiples cursos.
- Eliminaciones independientes y correctamente relacionadas.
- Supabase PostgreSQL como base de datos.
- API REST consumida mediante Supabase SDK.
- Funciones RPC para operaciones transaccionales cuando sean necesarias.
- Seguridad mediante RLS.
- Clean Architecture.
- Interfaz intuitiva.
- Scripts SQL documentados y versionados.
- memory.md actualizado con los avances reales.

El resultado debe ser funcional, sencillo de comprender y adecuado para un proyecto académico de Desarrollo de Software.