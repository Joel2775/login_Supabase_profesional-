# MEMORY.md - MEMORIA DEL PROYECTO

> Este archivo registra el estado real del desarrollo.
> Debe consultarse antes de cada tarea y actualizarse después de cada bloque de trabajo.

## 1. INFORMACIÓN GENERAL

- **Nombre del proyecto:** Por definir.
- **Tipo:** Aplicación móvil.
- **Framework:** Expo + React Native.
- **Lenguaje:** TypeScript.
- **Arquitectura:** Clean Architecture.
- **Navegación:** Expo Router.
- **Backend:** Supabase.
- **Autenticación:** Supabase Auth + Google OAuth.
- **Base de datos:** Supabase PostgreSQL.
- **Estilos:** Uniwind.
- **Animaciones:** Lottie.

## 2. ESTADO GENERAL DEL PROYECTO

- **Fase actual:** Parte 3 - sistema visual implementado y validado localmente.
- **Último bloque completado:** Parte 3 - Bloque 1 (Uniwind, Claymorphism y Lottie).
- **Estado:** CRUD académico e inscripciones están implementados. El usuario confirma que probó y funcionan altas/consultas/ediciones/eliminaciones de estudiantes y cursos, inscripciones, retiro, duplicados, cascadas, aislamiento entre usuarios (RLS) y persistencia en Supabase. Estas pruebas manuales no fueron ejecutadas ni verificadas independientemente desde este entorno. Las 27 pruebas automatizadas locales también pasan, pero utilizan dobles simulados. La Parte 3 aplica Uniwind y la identidad visual en autenticación y CRUD; los estados de carga, éxito y error integran animaciones Lottie locales. Los builds web/Android y una comprobación visual local pasaron; no se probó en un dispositivo físico ni contra Supabase.
- **Última actualización:** 2026-11-10.

## 3. REQUERIMIENTOS DEL PROYECTO

### Parte 1. Autenticación

- [x] Login con correo y contraseña (implementación; pendiente prueba contra Supabase).
- [x] Registro de usuarios mediante Supabase Auth (incluye confirmación por correo).
- [x] Recuperación y actualización de contraseña (implementación; pendiente prueba por correo).
- [x] Social Login con Google OAuth/PKCE (implementación; pendiente configurar Google y Supabase).
- [x] Gestión y persistencia de sesión con AsyncStorage.
- [x] Cierre de sesión.

### Parte 2. CRUD y contraseñas

- [x] Definir tema del CRUD: gestión de estudiantes, cursos e inscripciones.
- [x] Crear tablas en Supabase (usuario confirma ejecución de las migraciones 001-005; sin verificación remota independiente).
- [x] Implementar Create (código Domain/Data/UI; integración remota pendiente).
- [x] Implementar Read (código Domain/Data/UI; integración remota pendiente).
- [x] Implementar Update (código Domain/Data/UI; integración remota pendiente).
- [x] Implementar Delete (código Domain/Data/UI; integración remota pendiente).
- [x] Configurar políticas RLS (incluidas en las migraciones que el usuario confirma haber ejecutado; sin verificación remota independiente).
- [ ] Implementar cambio de contraseña.

### Parte 3. Diseño

- [x] Configurar Uniwind y Tailwind CSS 4.
- [x] Diseñar interfaz de login y registro.
- [x] Diseñar interfaz principal.
- [x] Diseñar interfaz del CRUD.
- [x] Integrar animaciones Lottie locales para carga, éxito y error.
- [x] Verificar los estados visuales y los builds disponibles.

## 4. ARQUITECTURA

### Presentation
Estado: Implementado: rutas de login, registro, recuperación, callback OAuth, cambio de contraseña, CRUD académico y página autenticada. Las pantallas visuales usan Uniwind/Claymorphism; `LottieState` centraliza animaciones por estado.

### Domain
Estado: Implementado: autenticación y entidades, contratos, validaciones y casos de uso académicos independientes de Supabase y React Native.

### Data
Estado: Implementado: repositorio Supabase Auth con flujo PKCE y repositorios académicos tipados, mapeadores y manejo de errores.

### Core
Estado: Implementado: cliente Supabase configurado desde variables de entorno; usa AsyncStorage en plataformas nativas y localStorage en web, con tolerancia a SSR.

### Shared
Estado: Componentes reutilizables de formularios, contenedor de autenticación y animaciones en Presentation; no se modificaron las dependencias entre capas.

## 5. DEPENDENCIAS INSTALADAS

Registrar las dependencias reales del proyecto.

| Dependencia | Versión | Estado |
|---|---|---|
| Expo | ~57.0.32 | Instalada |
| React Native | 0.86.3 | Instalada |
| TypeScript | ~6.0.3 | Instalada |
| @supabase/supabase-js | ^2.119.0 | Instalada |
| @react-native-async-storage/async-storage | 2.2.0 | Instalada |
| expo-linking | ~57.0.13 | Instalada |
| expo-web-browser | ~57.0.3 | Instalada |
| react-native-url-polyfill | ^4.0.0 | Instalada |
| eslint | ^9.0.0 | Instalada para habilitar el script lint |
| eslint-config-expo | ~57.0.2 | Instalada para habilitar el script lint |
| uniwind | ^1.13.2 | Instalada; sistema de clases para React Native |
| tailwindcss | ^4.3.5 | Instalada; requerida por Uniwind |
| lottie-react-native | ~7.3.8 | Instalada; animaciones nativas |
| @lottiefiles/dotlottie-react | ^0.13.5 | Instalada; peer requerido para renderizar Lottie en web |

## 6. VARIABLES DE ENTORNO

- [ ] Completar `.env` con las variables públicas del proyecto (el archivo local existente no fue modificado).
- [x] Mantener `.env.example` con placeholders, sin credenciales reales.
- [x] Excluir `.env` y otros archivos de entorno locales en `.gitignore`.
- [ ] Configurar URL y clave pública del proyecto Supabase.
- [x] No incluir claves `service_role` ni secretos de Google en el frontend.

Nunca registrar valores reales de credenciales en este archivo.

## 7. ARCHIVOS CREADOS

Registrar cada archivo importante y su responsabilidad.

| Archivo | Responsabilidad | Estado |
|---|---|---|
| `src/domain/entities/auth-user.ts` | Entidad de usuario autenticado | Creado |
| `src/domain/repositories/auth-repository.ts` | Contrato del repositorio de autenticación | Creado |
| `src/domain/use-cases/auth/*.ts` | Casos de uso de autenticación | Creados |
| `src/domain/entities/student.ts`, `course.ts`, `enrollment.ts` | Entidades y tipos de entrada para el CRUD académico | Creados en Bloque 3 |
| `src/domain/repositories/student-repository.ts`, `course-repository.ts`, `enrollment-repository.ts` | Contratos de repositorios académicos | Creados en Bloque 3 |
| `src/domain/use-cases/students/*.ts` | Casos de uso de estudiantes (CRUD) | Creados en Bloque 3 |
| `src/domain/use-cases/courses/*.ts` | Casos de uso de cursos (CRUD) | Creados en Bloque 3 |
| `src/domain/use-cases/enrollments/*.ts` | Inscribir, consultar cursos/estudiantes y retirar inscripción | Creados en Bloque 3 |
| `src/domain/validation/academic-validation.ts` | Validaciones de campos obligatorios, email y actualizaciones | Creado en Bloque 3 |
| `src/data/auth/supabase-auth-repository.ts` | Implementación Supabase Auth, Google OAuth y callbacks PKCE | Creado |
| `src/data/academic/academic-mappers.ts` | Mapeo de filas de Supabase a entidades Domain | Creado en Bloque 4 |
| `src/data/academic/supabase-errors.ts` | Verificación de sesión y traducción explícita de errores de Supabase | Creado en Bloque 4 |
| `src/data/academic/supabase-student-repository.ts` | CRUD de estudiantes con filtro del usuario autenticado | Creado en Bloque 4 |
| `src/data/academic/supabase-course-repository.ts` | CRUD de cursos con filtro del usuario autenticado | Creado en Bloque 4 |
| `src/data/academic/supabase-enrollment-repository.ts` | RPC de inscripción múltiple y consultas/retiro de inscripciones | Creado en Bloque 4 |
| `src/core/supabase/database.types.ts` | Tipos de tablas y RPC para Supabase SDK | Creado en Bloque 4 |
| `src/core/di/academic-dependencies.ts` | Composición de repositorios académicos y casos de uso | Creado en Bloque 4 |
| `tests/students-crud.test.cjs` | Pruebas unitarias simuladas para operaciones y validaciones de estudiantes | Creado en Bloque 5 |
| `tests/courses-crud.test.cjs` | Pruebas unitarias simuladas para operaciones y validaciones de cursos | Creado en Bloque 6 |
| `tests/enrollments.test.cjs` | Pruebas simuladas de RPC, consultas, retiro y validación de inscripciones | Creado en Bloque 7 |
| `src/core/supabase/client.ts` | Cliente Supabase y persistencia AsyncStorage | Creado |
| `src/core/di/auth-dependencies.ts` | Composición de casos de uso y repositorio | Creado |
| `src/presentation/auth/auth-provider.tsx` | Estado y acciones de autenticación para Presentation | Creado |
| `src/presentation/components/auth-form.tsx` | Campos, botones y mensajes reutilizables | Creado |
| `src/presentation/components/auth-screen.tsx` | Contenedor visual de pantallas de autenticación | Creado |
| `src/presentation/components/lottie-state.tsx` | Componente tipado compartido para animaciones de carga, éxito y error | Creado en Parte 3 |
| `src/presentation/academic/academic-ui.tsx` | Componentes comunes del CRUD con clases Uniwind y superficies Claymorphism | Creado en Parte 2; rediseñado en Parte 3 |
| `src/global.css` | Entrada de Tailwind/Uniwind y tokens de la paleta visual | Creado en Parte 3 |
| `metro.config.js` | Integración de Uniwind con Metro y generación de tipos | Creado en Parte 3 |
| `src/uniwind-types.d.ts` | Tipos generados por Uniwind para clases y temas | Generado en Parte 3 |
| `assets/animations/water-loading.json`, `success.json`, `error.json` | Animaciones Lottie locales para estados reales de interfaz | Creados en Parte 3 |
| `src/presentation/utils/validation.ts` | Validación de formato de correo en formularios | Creado |
| `src/app/sign-in.tsx` | Login por correo y Google | Creado |
| `src/app/sign-up.tsx` | Registro por correo | Creado |
| `src/app/forgot-password.tsx` | Solicitud de recuperación | Creado |
| `src/app/reset-password.tsx` | Callback y actualización de contraseña | Creado |
| `src/app/auth/callback.tsx` | Callback de OAuth | Creado |
| `src/app/home.tsx` | Pantalla autenticada y cierre de sesión | Creado |
| `supabase/migrations/001_create_students.sql` | Tabla de estudiantes, restricciones y unicidad de identificación por propietario | Creado; pendiente de ejecutar |
| `supabase/migrations/002_create_courses.sql` | Tabla de cursos y unicidad normalizada del nombre por propietario | Creado; pendiente de ejecutar |
| `supabase/migrations/003_create_enrollments.sql` | Tabla de inscripciones, claves foráneas compuestas e índices | Creado; pendiente de ejecutar |
| `supabase/migrations/004_configure_rls.sql` | RLS y políticas CRUD por propietario para las tres tablas | Creado; pendiente de ejecutar |
| `supabase/migrations/005_create_enrollment_rpc.sql` | RPC transaccional para inscribir a un estudiante en varios cursos | Creado; pendiente de ejecutar |
| `.env.example` | Plantilla sin credenciales | Actualizado |
| `eslint.config.js` | Configuración generada para habilitar lint | Creado |

## 8. ARCHIVOS MODIFICADOS

| Archivo | Modificación |
|---|---|
| `.gitignore` | Excluye archivos `.env` locales y permite conservar `.env.example`. |
| `README.md` | Documenta configuración de Auth, migraciones y el sistema visual Uniwind/Lottie. |
| `package.json`, `package-lock.json` | Añade Uniwind, Tailwind CSS 4, Lottie y su renderer web; conserva las dependencias y scripts previos. |
| `app.json` | Alinea el modo de interfaz, el fondo de icono Android y splash con el tema claro. |
| `metro.config.js`, `src/global.css`, `src/uniwind-types.d.ts` | Configura Uniwind, los tokens CSS y tipos generados. |
| `assets/animations/*.json` | Añade las animaciones Lottie locales para estados de carga, éxito y error. |
| `src/app/_layout.tsx` | Importa la hoja global de Uniwind y conserva los proveedores y callback del navegador. |
| `src/app/index.tsx`, `src/app/sign-in.tsx`, `src/app/sign-up.tsx`, `src/app/forgot-password.tsx`, `src/app/reset-password.tsx`, `src/app/auth/callback.tsx` | Aplica el diseño de autenticación y los componentes compartidos sin alterar sus flujos. |
| `src/app/home.tsx`, `src/app/students/`, `src/app/courses/`, `src/app/enrollments.tsx` | Aplica estilos Uniwind a panel, CRUD e inscripciones; conserva sus operaciones y navegación. |
| `src/presentation/components/auth-screen.tsx`, `auth-form.tsx`, `src/presentation/academic/academic-ui.tsx` | Rediseña componentes reutilizables con la paleta azul, superficies elevadas y clases Uniwind. |
| `src/core/supabase/client.ts` | Tipado de base de datos y reutilización de una única instancia Supabase entre módulos. |
| `src/data/auth/supabase-auth-repository.ts` | Adapta el repositorio de Auth a la instancia Supabase tipada. |
| `package.json` | Añade el script `test:students` usando el test runner integrado de Node. |
| `package.json` | Añade el script `test:courses` usando el test runner integrado de Node. |
| `package.json` | Añade el script `test:enrollments` usando el test runner integrado de Node. |
| `MEMORY.md` | Registra análisis, migraciones creadas, estado de ejecución y siguiente paso. |

## 9. CONFIGURACIONES EXTERNAS

### Supabase
- Proyecto creado: Pendiente de confirmar fuera del repositorio.
- URL configurada: Pendiente de confirmar.
- Auth configurado: Pendiente de habilitar/configurar Email en el dashboard.
- Google OAuth: Pendiente de habilitar y cargar credenciales en el dashboard de Supabase.
- Base de datos: El usuario confirma que ejecutó las cinco migraciones académicas; no se verificó el estado remoto de forma independiente.
- RLS: Incluida en las migraciones; ejecución confirmada por el usuario, sin verificación remota independiente.

### Google Cloud
- Proyecto creado: Pendiente de confirmar.
- Client ID configurado: Pendiente.
- Client Secret configurado en Supabase: Pendiente; nunca debe guardarse en el frontend.
- URLs de redirección: Código utiliza `loginprofesional://auth/callback` y `loginprofesional://reset-password`; falta registrarlas y probarlas.

No guardar secretos ni credenciales reales.

## 10. PROBLEMAS ENCONTRADOS Y SOLUCIONES

- El chequeo TypeScript global también compila el directorio `example/`, cuyos imports apuntan a componentes que ya están eliminados en el worktree previo a esta tarea. Se verificaron los archivos de autenticación con una configuración temporal de alcance limitado, luego eliminada.
- El primer lint detectó actualizaciones de estado síncronas en efectos. Se refactorizaron los estados para derivar valores de props/contexto y el lint final pasó.
- `npm audit --omit=dev` había reportado 7 advisories (4 moderados y 3 altos) en dependencias existentes de Expo/Expo Router; ese resultado no se repitió después de instalar las dependencias visuales. Los comandos `npm install` de esta tarea informaron 12 vulnerabilidades en el árbol completo (9 moderadas y 3 altas), sin ejecutar `npm audit fix` ni actualizar Expo/Router.
- La primera exportación web falló porque Lottie requería el peer `@lottiefiles/dotlottie-react`; se instaló y la exportación final pasó. La vista web de Lottie no aplicaba `style`; se añadió `webStyle` y se verificó en el navegador que la animación de error quedara acotada al tamaño esperado. Se eliminó una prop de accesibilidad no soportada por el tipo de Lottie.

## 11. HISTORIAL DE DESARROLLO

Registrar cronológicamente cada bloque completado.

### Bloque 1 - Autenticación mixta
- Estado: Implementación completada; integración externa pendiente.
- Descripción: Se añadieron las capas Domain, Data, Core y Presentation para login, registro, Google OAuth, recuperación/cambio de contraseña, persistencia de sesión y cierre de sesión.
- Validaciones: `npm run lint`, TypeScript acotado a `src/`, `npx expo export --platform web`, `npx expo export --platform android` y `npx expo install --check` pasaron.
- Integración end-to-end con Supabase/Google: Pendiente de credenciales de proyecto y configuración del dashboard.

### Parte 2 - Bloque 1: análisis y diseño
- Estado: Completado como análisis; no se modificó código ni base de datos.
- Revisión: La estructura existente separa `app`, `core`, `data`, `domain` y `presentation`. El cliente de Supabase y el repositorio de autenticación ya existen; `AuthUser.id` representa el ID de Supabase Auth y la sesión se expone mediante `useAuth`. La pantalla autenticada actual solo permite cerrar sesión. No hay repositorios, casos de uso ni consultas académicas.
- Dependencias: `@supabase/supabase-js` y AsyncStorage ya están en `package.json`; no se instalaron dependencias. Uniwind y Lottie no aparecen entre las dependencias instaladas.
- Diseño propuesto (no implementado):
  - `students`: UUID, `user_id` propietario, identificación, nombres, apellidos, email opcional y teléfono opcional; identificación no vacía y única por propietario.
  - `courses`: UUID, `user_id` propietario, nombre y descripción opcional; nombre no vacío y único por propietario sin distinguir mayúsculas/minúsculas ni espacios externos.
  - `enrollments`: UUID, `user_id`, `student_id`, `course_id` y fecha de inscripción; relación muchos-a-muchos, pareja estudiante/curso única y claves foráneas compuestas que impidan asociar registros de propietarios distintos.
  - Las tres tablas referenciarán `auth.users`; borrar estudiante o curso eliminará solo sus inscripciones mediante `ON DELETE CASCADE`. Borrar una inscripción conservará estudiante y curso.
  - RLS en las tres tablas con políticas CRUD limitadas a `user_id = auth.uid()`; las políticas de actualización comprobarán propietario tanto con `USING` como con `WITH CHECK`. Para inscripciones, las claves foráneas compuestas complementarán el aislamiento del propietario.
  - El Domain definirá entidades y contratos; Data usará el cliente existente de Supabase SDK para CRUD sencillo y la capa Presentation accederá a casos de uso, no a Supabase directamente. Una futura inscripción de varios cursos se evaluará para RPC transaccional; no se requiere RPC para CRUD simple.
- Secuencia diseñada para el Bloque 2 e implementada como migraciones: `001_create_students.sql`, `002_create_courses.sql`, `003_create_enrollments.sql`, `004_configure_rls.sql` y `005_create_enrollment_rpc.sql`.
- Pruebas: No ejecutadas; este bloque fue de revisión y diseño.

### Parte 2 - Bloque 2: migraciones de base de datos
- Estado: Migraciones implementadas; el usuario confirma que ejecutó las cinco en Supabase. Verificación remota independiente pendiente.
- Tablas en código: `students`, `courses` y `enrollments`. Incluyen propietario `user_id`, restricciones de campos requeridos, unicidad por propietario, timestamps y claves foráneas a `auth.users`.
- Relaciones en código: relación muchos-a-muchos mediante `enrollments`; claves foráneas compuestas garantizan que estudiante y curso pertenezcan al propietario de la inscripción; `ON DELETE CASCADE` elimina inscripciones al borrar su estudiante o curso.
- Seguridad en código: RLS activada en las tres tablas; políticas CRUD `authenticated` limitadas a `auth.uid()`, `USING`/`WITH CHECK` en actualizaciones, y sin permisos de tabla para `PUBLIC`/`anon`.
- RPC en código: `public.enroll_student_in_courses` valida sesión, propiedad y cursos solicitados, deduplica IDs y agrega varias inscripciones en una transacción. Es `SECURITY INVOKER`, fija `search_path` vacío y concede ejecución solo a `authenticated`. Su ejecución está incluida en la confirmación del usuario; no probada por separado ni verificada remotamente.
- Archivos: cinco migraciones `001`–`005` en `supabase/migrations/`; README actualizado con orden e instrucciones de ejecución manual.
- Herramientas/dependencias: no se instalaron dependencias. Supabase CLI y `psql` no están disponibles localmente; el usuario reporta la ejecución por su cuenta.
- Validaciones: `git diff --check` pasó al crear las migraciones. No se inspeccionó el estado remoto.

### Parte 2 - Bloque 3: Domain
- Estado: Implementado y validado localmente.
- Entidades: `Student`, `Course` y `Enrollment`, con tipos de entrada para creación y actualización.
- Contratos: repositorios de estudiantes, cursos e inscripciones, sin dependencias de Supabase ni React Native.
- Casos de uso: CRUD de estudiantes y cursos; inscripción múltiple, consulta de cursos por estudiante, estudiantes por curso y retiro de inscripción.
- Validaciones de Domain: campos obligatorios, email, campos editables y lista de cursos sin duplicados. Se normalizan textos opcionales y entradas de texto.
- Archivos: entidades, contratos, casos de uso y `src/domain/validation/academic-validation.ts`.
- Validaciones ejecutadas: `npm run lint`, TypeScript estricto acotado a `src/domain` y `git diff --check` pasaron. El primer type-check acotado mostró un error de tipado en el helper de actualización; se corrigió y la siguiente ejecución pasó.
- Dependencias instaladas: ninguna.

### Ajuste de navegación de autenticación
- Problema: Al iniciar sesión correctamente desde `/sign-in`, la pantalla no observaba el usuario autenticado ni redirigía; el proveedor sí actualiza la sesión, pero el usuario podía quedarse en el login.
- Cambio: `src/app/sign-in.tsx` ahora redirige a `/home` cuando `useAuth` expone un usuario, siguiendo el patrón ya usado en registro. `/home` sigue siendo la pantalla autenticada provisional, no el CRUD.
- Alcance: No se modificó configuración de Supabase ni se verificó un inicio de sesión real. Desactivar confirmación de correo no reemplaza la comprobación de credenciales, URL/clave de Supabase ni configuración de Email.
- Validación: `npm run lint` y `git diff --check` pasaron.

### Parte 2 - Bloque 4: Data
- Estado: Implementado y validado localmente; no se probaron operaciones contra el proyecto Supabase remoto.
- Repositorios: CRUD de estudiantes y cursos; inscribir por RPC, consultar cursos de un estudiante y estudiantes de un curso, retirar una inscripción. Las operaciones incluyen `user_id` obtenido mediante `auth.getUser()` y filtros de propietario, complementarios a RLS.
- Mapeadores y errores: filas Supabase se convierten en entidades Domain; errores comunes de unicidad, claves foráneas y permisos se muestran explícitamente. Ausencia de registros se informa como no encontrado y no se trata como éxito.
- Tipado: tipos de tablas/RPC para SDK y cliente Supabase singleton compartido entre autenticación y repositorios académicos.
- Inyección: `createAcademicDependencies` conecta repositorios y casos de uso; Presentation aún no los consume.
- Archivos: repositorios y helpers bajo `src/data/academic/`, `src/core/supabase/database.types.ts` y `src/core/di/academic-dependencies.ts`; cliente Core y repositorio Auth tipados.
- Validaciones: `npm run lint`, TypeScript estricto del código de `src/` (configuración temporal fuera del repositorio) y `git diff --check` pasaron.
- Limitación: `npx tsc --noEmit` global aún reporta imports inexistentes y una ruta inválida en `example/`, que no es el código principal y no forma parte de este cambio.
- Dependencias instaladas: ninguna.

### Parte 2 - Bloque 5: CRUD de estudiantes
- Estado: Operaciones de estudiantes implementadas en Domain/Data y cubiertas con pruebas unitarias simuladas. Sin UI ni prueba real del backend.
- Operaciones incluidas: crear, listar (solo usuario autenticado), consultar por ID, actualizar campos provistos y eliminar. Se comprueba que registros ajenos no se actualicen/eliminarán por ID y propietario; eliminación inexistente se reporta explícitamente.
- Validaciones cubiertas: campos requeridos, normalización, email, identificación duplicada, propiedad asignada desde la sesión; mapeo de entidad.
- Pruebas: `npm run test:students` pasó 8/8 casos usando un cliente Supabase simulado; `npm run lint`, TypeScript estricto para `src/` y `git diff --check` pasaron.
- Integración remota: no ejecutada; no se afirma que las operaciones hayan sido probadas contra el proyecto Supabase del usuario.
- Pantallas: aún no implementadas; corresponden al bloque de interfaz posterior.
- Dependencias instaladas: ninguna; se utilizó `node:test` integrado en Node y TypeScript ya existente.

### Parte 2 - Bloque 6: CRUD de cursos
- Estado: Operaciones CRUD disponibles en Domain/Data y cubiertas con pruebas unitarias simuladas; no se probó el backend real.
- Operaciones incluidas: crear y listar cursos del usuario autenticado, consultar por ID, actualizar campos provistos y eliminar. Se informa explícitamente si un curso no existe o no está disponible.
- Validaciones cubiertas: nombre obligatorio, normalización de nombre/descripción, actualización con campos permitidos, nombre duplicado y propiedad del usuario.
- Pruebas: `npm run test:courses` pasó 9/9; regresión `npm run test:students` pasó 8/8; `npm run lint`, TypeScript estricto para `src/` y `git diff --check` pasaron.
- Integración remota: no ejecutada; no se afirma que las operaciones hayan sido probadas contra Supabase del usuario.
- Pantallas: aún no implementadas; corresponden al bloque de interfaz posterior.
- Dependencias instaladas: ninguna; se usó `node:test` incluido en Node.

### Parte 2 - Bloque 7: inscripciones
- Estado: Inscripción múltiple, consultas en ambos sentidos y retiro implementados en Domain/Data; pruebas unitarias simuladas pasan. Sin prueba contra el backend remoto.
- Inscribir: usa la RPC transaccional `enroll_student_in_courses`; Domain valida estudiante, al menos un curso e IDs duplicados, y los errores de propiedad/clave foránea se propagan con mensajes entendibles. La restricción única de la base evita duplicados existentes; la RPC omite los cursos ya inscritos mediante `ON CONFLICT DO NOTHING`.
- Consultas: obtiene cursos de un estudiante y estudiantes de un curso, verificando antes que el recurso principal pertenezca al usuario autenticado y filtrando inscripciones/recursos por `user_id`.
- Retiro: elimina únicamente la inscripción del usuario actual; no elimina al estudiante ni al curso. El intento sobre una inscripción inexistente/no propia produce error explícito.
- Pruebas: `npm run test:enrollments` pasó 10/10; `npm run test:students` pasó 8/8; `npm run test:courses` pasó 9/9; `npm run lint`, TypeScript estricto para `src/` y `git diff --check` pasaron.
- Integración remota: no ejecutada; migraciones reportadas como ejecutadas por el usuario pero sin verificación independiente.
- Archivos: `tests/enrollments.test.cjs`; script `test:enrollments` agregado a `package.json`. No se instalaron dependencias.

### Parte 2 - Bloque 8: interfaz
- Estado: Pantallas académicas implementadas e integradas con casos de uso; compilación web, lint, type-check de `src/` y pruebas simuladas pasan. No se han probado operaciones contra Supabase remoto.
- Panel: `/home` muestra accesos a estudiantes, cursos e inscripciones, cantidades cuando están disponibles y cierre de sesión.
- Estudiantes: lista, creación, detalle, edición y eliminación con confirmación; desde el detalle se consultan inscripciones y se enlaza a su gestión.
- Cursos: lista, creación, detalle, edición y eliminación con confirmación; desde el detalle se consultan estudiantes inscritos.
- Inscripciones: selección de estudiante, selección de varios cursos, creación conjunta, consulta de inscripciones actuales y retiro sin borrar estudiante ni curso.
- Integración y arquitectura: `AcademicProvider` compone dependencias en Presentation; las pantallas usan casos de uso y no consultan Supabase directamente. Se agregó `GetStudentEnrollments` para consultar IDs/fechas y retirar inscripciones desde la interfaz.
- Cliente web: el export estático detectó que AsyncStorage web accedía a `window` durante SSR. `src/core/supabase/client.ts` ahora usa `localStorage` en navegador web, almacenamiento sin persistencia durante SSR (donde no existe sesión de navegador) y AsyncStorage en plataformas nativas.
- Archivos: rutas nuevas bajo `src/app/students/` y `src/app/courses/`, `src/app/enrollments.tsx`, `src/presentation/academic/`, además de ajustes a `src/app/_layout.tsx`, `src/app/home.tsx`, `src/core/di/academic-dependencies.ts`, `src/core/supabase/client.ts`, repositorio/contrato de inscripciones y `package.json`.
- Interfaz: utiliza React Native `StyleSheet`; no se instalaron dependencias ni se agregaron Uniwind/Lottie.
- Validaciones: `npm run lint` pasó; TypeScript estricto acotado a `src/` pasó usando configuración temporal fuera del repositorio; `npx expo export --platform web` pasó y generó 18 rutas estáticas; `npm run test:students` pasó 8/8, `npm run test:courses` 9/9, `npm run test:enrollments` 10/10; `git diff --check` pasó.
- Pruebas reales: no se inició sesión ni se ejecutaron operaciones CRUD contra el Supabase remoto. Las pruebas de repositorios usan dobles simulados.

### Parte 2 - Bloque 9: pruebas finales
- Estado: El usuario reporta haber completado con éxito las pruebas end-to-end en Supabase; cierre basado en su confirmación, no en ejecución independiente desde este entorno.
- Pruebas simuladas: `npm run test:students` pasó 8/8; `npm run test:courses` pasó 9/9; `npm run test:enrollments` pasó 10/10 (27/27 en total). Verifican mapeo, operaciones, filtros de propietario, validaciones y llamadas a RPC usando doubles; no ejecutan SQL ni comprueban RLS/persistencia.
- Calidad y builds: `npm run lint`, TypeScript estricto acotado a `src/` con configuración temporal fuera del repositorio y `git diff --check` pasaron.
- Builds: `npx expo export --platform android` pasó; `npx expo export --platform web` pasó y generó 18 rutas estáticas.
- Pruebas remotas reportadas por el usuario: altas, consultas y ediciones de estudiantes/cursos; altas y consultas de inscripciones; retiro de inscripción conservando sus entidades; comportamiento ante duplicados; cascada al borrar estudiante/curso; aislamiento por usuario mediante RLS; y persistencia. El usuario también reportó resolver la RPC ejecutando la migración `005_create_enrollment_rpc.sql`.
- Alcance de la evidencia: no se ejecutaron operaciones contra el Supabase remoto desde este entorno ni se inspeccionaron resultados; la confirmación de los casos end-to-end proviene del usuario.
- Dependencias instaladas: ninguna.

### Parte 3 - Bloque 1: Uniwind, Claymorphism y Lottie
- Estado: Implementado y validado localmente; sin pruebas en dispositivo físico ni contra servicios remotos.
- Configuración: Tailwind CSS 4 y Uniwind integrados en Metro; `src/global.css` define los tokens de color y se importa desde el layout de Expo Router. `src/uniwind-types.d.ts` fue generado por Metro.
- Interfaz: autenticación, inicio/panel y pantallas de estudiantes, cursos e inscripciones migradas a `className`, con superficies elevadas, campos suaves y la paleta azul/dorada/roja solicitada. Se mantuvo la navegación y lógica de autenticación/CRUD; el modo de interfaz y los fondos de splash/icono Android se alinearon al tema claro.
- Animaciones: `LottieState` reutilizable usa assets locales para carga, éxito y error. Se muestran durante cargas, mensajes de éxito y errores. `@lottiefiles/dotlottie-react` habilita Lottie en web.
- Documentación: README actualizado con la configuración del sistema visual y ubicación de animaciones.
- Dependencias instaladas: `uniwind` ^1.13.2, `tailwindcss` ^4.3.5, `lottie-react-native` ~7.3.8 y `@lottiefiles/dotlottie-react` ^0.13.5. No se cambió la versión de Expo SDK 57.
- Validaciones: `npm run lint`, type-check estricto de `src/` y `expo-env.d.ts`, `npx expo install --check`, validación JSON de las tres animaciones, `git diff --check`, `npx expo export --platform web` (18 rutas) y `npx expo export --platform android` pasaron. En navegador se inspeccionó `/sign-in` y se comprobó el mensaje de validación con animación de error. El build Android no equivale a prueba en dispositivo.
- Incidencias resueltas: se agregó el peer requerido de Lottie para web, se ajustó el tamaño web mediante `webStyle` y se retiró la prop no compatible indicada por TypeScript.
- Corrección de pantalla blanca Android (2026-11-11): `SafeAreaView` de `react-native-safe-area-context` no aplica las clases `className` de Uniwind como los componentes de React Native. Se añadieron estilos nativos de estructura (`flex: 1` y fondo) al estado de carga y al contenedor de `AcademicPage`, además de `flex: 1` en `KeyboardAvoidingView` y `ScrollView`. Se retiraron los logs temporales y se dejó un indicador nativo con texto para la restauración inicial de sesión.
- Validación Android: se abrió la app en Expo Go del emulador y se comprobó visualmente que `/sign-in` renderiza en lugar de la pantalla en blanco. El panel autenticado no se verificó en esta última ejecución porque el emulador llegó a la pantalla de inicio de sesión.
- Validaciones de esta corrección: `npx expo export --platform android`, lint de los tres archivos afectados, TypeScript estricto acotado a `src/` y `expo-env.d.ts`, `git diff --check` y `npm run test:enrollments` (10/10) pasaron. `npm run lint` completo sigue reportando imports ausentes y una ruta no tipada bajo `example/src/`; no corresponden a estos cambios.

## 12. SIGUIENTE BLOQUE

- **Bloque:** Parte 3 visual completada localmente.
- **Objetivo siguiente:** Verificar el panel autenticado en Expo Go después de iniciar sesión; luego implementar cambio de contraseña de la Parte 2 y, cuando se disponga de configuración externa, validar Supabase Auth/Google OAuth en un entorno aislado.
- **Estado:** La pantalla en blanco se corrigió y la pantalla de inicio de sesión se verificó en Android. Falta confirmar visualmente el panel autenticado con una sesión activa. Las operaciones CRUD remotas se mantienen respaldadas por la confirmación del usuario, no por una validación independiente desde este entorno.

### Ajuste de selección de cuenta Google (2026-11-10)
- Problema: Google podía reutilizar la cuenta que seguía abierta en el navegador OAuth sin mostrar la selección de cuenta.
- Cambio: El inicio OAuth añade `prompt=select_account` para solicitar el selector de cuentas en Google. El README aclara que cerrar sesión dentro de la aplicación es necesario para cambiar una sesión de aplicación ya activa y que Google puede no pedir contraseña mientras su propia sesión siga iniciada.
- Archivos modificados: `src/data/auth/supabase-auth-repository.ts`, `README.md` y `MEMORY.md`.
- Dependencias instaladas: ninguna.
- Validaciones: ESLint dirigido al repositorio de autenticación y `git diff --check` pasaron; `npx expo export --platform web` pasó y generó 18 rutas. `npx tsc --noEmit` sigue fallando por imports ausentes y una ruta no tipada en `example/`, ajenos a este cambio. No se pudo verificar el selector con Google real porque requiere la configuración OAuth externa.
- Limitación: Borrar un usuario en Supabase no elimina su cuenta Google. Si se vuelve a seleccionar esa identidad, el proveedor OAuth puede autenticarla de nuevo; este cambio permite escoger una identidad diferente, pero no bloquea la cuenta eliminada.
- Siguiente paso: ejecutar lint y type-check acotado y probar el selector con la configuración OAuth real.

### Diagnóstico de prueba OAuth en Android Expo Go (2026-11-10)
- Reporte del usuario: En un emulador Android Studio con Expo Go, Google regresa a una URL de callback `exp://<IP-LAN>:<puerto>/--/auth/callback?code=...`, pero informa que la pantalla queda en blanco y que no pudo seleccionar otra cuenta. No almacenar ni compartir el código temporal de OAuth.
- Interpretación: Google completó el redireccionamiento y Chrome muestra la URI `exp://`, pero el enlace no volvió automáticamente a Expo Go; por eso el intercambio del código y la navegación de la app no están confirmados. El selector de cuentas aparece antes de ese retorno. La prueba usa el callback dinámico de Expo Go, distinto del scheme `loginprofesional` de una development build.
- Documentación: README aclara que hay que permitir la URL `exp://` exacta que genera Metro en **Supabase → Authentication → URL Configuration → Redirect URLs**; varía con IP/puerto. Para un ciclo repetible se recomienda development build con scheme estable.
- Borrado para pruebas: El usuario de Supabase puede eliminarse desde **Authentication → Users**; la cuenta Google no se borra y puede volver a crear el usuario Supabase al autenticar de nuevo. Por las FK con cascada, borrar el usuario Auth también elimina los registros académicos asociados.
- Pendiente: lograr que el callback `exp://` abra Expo Go (o repetir la prueba con development build) y probar una segunda identidad Google; no se ha probado OAuth desde el emulador de este entorno.

## 13. INSTRUCCIONES DE CONTINUIDAD

Antes de cada nueva tarea:

1. Consultar AGENTS.md.
2. Leer este archivo.
3. Verificar el estado real del código.
4. Identificar el último bloque completado.
5. Continuar desde el siguiente paso pendiente.

Al finalizar cada tarea:

1. Actualizar los estados.
2. Registrar los archivos creados y modificados.
3. Registrar las pruebas realizadas.
4. Actualizar el siguiente bloque.
5. Guardar los cambios en este archivo.

**IMPORTANTE:** No inventar avances. Este documento debe reflejar lo que realmente existe en el proyecto.