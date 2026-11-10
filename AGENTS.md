# AGENTS.md - REGLAS GENERALES DEL PROYECTO

## 1. INSTRUCCIÓN PRINCIPAL

Antes de realizar cualquier tarea, modificación o implementación, debes leer completamente este archivo (`AGENTS.md`) y posteriormente leer `memory.md`, ambos ubicados en la raíz del proyecto.

Estos dos archivos son obligatorios para trabajar.

- `AGENTS.md`: contiene las reglas, arquitectura, tecnologías y restricciones del proyecto.
- `memory.md`: contiene el estado actual, avances, decisiones y tareas pendientes.

Nunca comiences a programar sin consultar ambos archivos.

## 2. INFORMACIÓN DEL PROYECTO

El proyecto consiste en una aplicación móvil desarrollada con:

- Expo.
- React Native.
- TypeScript.
- Expo Router.
- Supabase Auth.
- Google OAuth.
- Supabase PostgreSQL.
- Uniwind.
- Lottie.

El proyecto debe desarrollarse progresivamente y mantenerse preparado para futuras ampliaciones.

## 3. ARQUITECTURA OBLIGATORIA: CLEAN ARCHITECTURE

Toda la aplicación debe respetar Clean Architecture.

Se utilizarán las siguientes capas:

### Presentation
- Pantallas.
- Componentes visuales.
- Hooks de presentación.
- Gestión de estados de interfaz.
- Navegación.
- Integración de Uniwind y Lottie.

No debe contener consultas directas a Supabase ni reglas de negocio.

### Domain
- Entidades.
- Interfaces y contratos de repositorios.
- Casos de uso.
- Reglas de negocio.

Esta capa debe ser independiente de React Native, Expo y Supabase.

### Data
- Implementaciones de repositorios.
- Consultas a Supabase.
- Mappers.
- Conversión de datos.
- Manejo de respuestas del proveedor externo.

Debe implementar los contratos definidos en Domain.

### Core
- Configuración de Supabase.
- Configuraciones generales.
- Variables de entorno.
- Almacenamiento.
- Servicios fundamentales.

### Shared
- Componentes reutilizables.
- Utilidades.
- Constantes.
- Tipos compartidos.
- Animaciones reutilizables.

### Regla de dependencias

Las dependencias deben apuntar hacia Domain.

- Presentation puede depender de Domain.
- Data implementa los contratos de Domain.
- Domain no depende de Presentation ni de Data.
- Core proporciona configuraciones e infraestructura.
- Evitar dependencias circulares.

No cambiar la arquitectura sin autorización del usuario.

## 4. SEGURIDAD Y VARIABLES DE ENTORNO

Está prohibido escribir credenciales y secretos directamente en el código fuente.

Toda configuración externa debe manejarse mediante variables de entorno o mecanismos seguros apropiados.

Ejemplo de `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
```

Reglas obligatorias:

1. No escribir credenciales reales directamente en archivos TypeScript.
2. No subir `.env` al repositorio.
3. Mantener `.env.example` sin credenciales reales.
4. No colocar claves `service_role` en React Native.
5. No colocar Google Client Secret en el frontend.
6. Utilizar exclusivamente claves públicas en el cliente móvil.
7. Los secretos privados deben permanecer en Supabase o en infraestructura de servidor segura.
8. Verificar que `.gitignore` excluya los archivos sensibles.

IMPORTANTE: Las variables `EXPO_PUBLIC_` son visibles en el código compilado de la aplicación. Nunca deben contener secretos.

## 5. REGLAS DE DESARROLLO

- Trabajar por bloques pequeños.
- Implementar únicamente lo solicitado.
- No adelantarse a funcionalidades futuras.
- No duplicar archivos o componentes.
- No eliminar código funcional sin justificación.
- Revisar el código existente antes de modificarlo.
- Reutilizar componentes cuando sea conveniente.
- Evitar abstracciones innecesarias.
- Mantener nombres claros y consistentes.
- Utilizar TypeScript correctamente.
- Comprobar compatibilidad de dependencias con la versión de Expo instalada.

## 6. TECNOLOGÍAS Y SUS RESPONSABILIDADES

### Expo y React Native
Utilizar para desarrollar la aplicación móvil.

### Expo Router
Gestionar las rutas y navegación.

### Supabase Auth
Gestionar registro, login, Google OAuth, sesiones, recuperación y cambio de contraseña.

### Supabase PostgreSQL
Gestionar las operaciones CRUD.

### Uniwind
Utilizar para construir la interfaz mediante clases utilitarias.

### Lottie
Utilizar animaciones que representen estados reales de la aplicación, como:
- Cargando.
- Inicio de sesión exitoso.
- Registro exitoso.
- Error.
- Operaciones CRUD.
- Estados vacíos.

### AsyncStorage
Utilizar para persistencia de sesión cuando corresponda a la configuración de Supabase para React Native.

## 7. CONTROL DE CALIDAD

Al finalizar cada tarea:

- Verificar errores de TypeScript.
- Comprobar imports y dependencias.
- Revisar las responsabilidades de cada capa.
- Verificar que no existan credenciales expuestas.
- Comprobar que las funcionalidades anteriores continúen funcionando.
- Ejecutar las comprobaciones disponibles.
- No afirmar que una funcionalidad está terminada si no ha sido verificada.

## 8. GESTIÓN OBLIGATORIA DE MEMORY.MD

`memory.md` es el archivo encargado de mantener la continuidad del proyecto.

### Antes de comenzar una tarea

1. Leer `AGENTS.md`.
2. Leer `memory.md`.
3. Identificar el último bloque completado.
4. Revisar las tareas pendientes.
5. Inspeccionar los archivos relacionados.
6. Continuar desde el estado real del proyecto.

### Al finalizar cada tarea

Actualizar `memory.md` obligatoriamente.

Registrar:
- Qué se implementó.
- Qué archivos se crearon.
- Qué archivos se modificaron.
- Qué dependencias se instalaron.
- Qué configuraciones se realizaron.
- Qué pruebas se ejecutaron.
- Qué errores se encontraron y solucionaron.
- Qué queda pendiente.
- Cuál es el siguiente bloque.

No marcar tareas como completadas sin verificarlas.

Si una tarea queda incompleta, registrar exactamente dónde se detuvo y qué falta.

### Continuidad entre conversaciones

Cada vez que el usuario envíe una nueva petición, consultar ambos archivos y continuar el trabajo anterior.

No comenzar desde cero ni repetir implementaciones que ya existen.

## 9. NIVEL DE EXPLICACIÓN

El usuario está aprendiendo desarrollo de software.

Por tanto:

- Explicar las implementaciones de forma clara.
- Mantener un nivel adecuado para un estudiante universitario.
- Explicar la responsabilidad de los archivos.
- Justificar las decisiones técnicas.
- Explicar las dependencias instaladas.
- Proporcionar código completo cuando sea necesario.
- Evitar complejidad innecesaria.

## 10. REGLA FINAL

Este proyecto debe desarrollarse respetando permanentemente Clean Architecture, la seguridad de las credenciales y la continuidad del trabajo mediante `memory.md`.

Antes de programar, leer las instrucciones y el estado del proyecto.

Después de programar, verificar y actualizar la memoria.

Nunca perder el progreso de una tarea a otra.