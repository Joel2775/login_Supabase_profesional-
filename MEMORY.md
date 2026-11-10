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

- **Fase actual:** Parte 1 - Autenticación.
- **Último bloque completado:** Implementación de la autenticación por capas.
- **Estado:** Código implementado y validado; falta configurar/validar los proveedores externos.
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

- [ ] Definir tema del CRUD.
- [ ] Crear tablas en Supabase.
- [ ] Implementar Create.
- [ ] Implementar Read.
- [ ] Implementar Update.
- [ ] Implementar Delete.
- [ ] Configurar políticas RLS.
- [ ] Implementar cambio de contraseña.

### Parte 3. Diseño

- [ ] Configurar Uniwind.
- [ ] Diseñar interfaz de login.
- [ ] Diseñar interfaz de registro.
- [ ] Diseñar interfaz principal.
- [ ] Diseñar interfaz del CRUD.
- [ ] Integrar animaciones Lottie.
- [ ] Verificar estados de carga, éxito y error.

## 4. ARQUITECTURA

### Presentation
Estado: Implementado: rutas de login, registro, recuperación, callback OAuth, cambio de contraseña y página autenticada.

### Domain
Estado: Implementado: entidad y contrato de autenticación con casos de uso.

### Data
Estado: Implementado: repositorio Supabase Auth con flujo PKCE.

### Core
Estado: Implementado: cliente Supabase configurado desde variables de entorno y AsyncStorage.

### Shared
Estado: Componentes reutilizables de formularios y contenedor de autenticación en Presentation.

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
| Uniwind | Pendiente | Fuera del bloque de autenticación |
| Lottie | Pendiente | Fuera del bloque de autenticación |

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
| `src/data/auth/supabase-auth-repository.ts` | Implementación Supabase Auth, Google OAuth y callbacks PKCE | Creado |
| `src/core/supabase/client.ts` | Cliente Supabase y persistencia AsyncStorage | Creado |
| `src/core/di/auth-dependencies.ts` | Composición de casos de uso y repositorio | Creado |
| `src/presentation/auth/auth-provider.tsx` | Estado y acciones de autenticación para Presentation | Creado |
| `src/presentation/components/auth-form.tsx` | Campos, botones y mensajes reutilizables | Creado |
| `src/presentation/components/auth-screen.tsx` | Contenedor visual de pantallas de autenticación | Creado |
| `src/presentation/utils/validation.ts` | Validación de formato de correo en formularios | Creado |
| `src/app/sign-in.tsx` | Login por correo y Google | Creado |
| `src/app/sign-up.tsx` | Registro por correo | Creado |
| `src/app/forgot-password.tsx` | Solicitud de recuperación | Creado |
| `src/app/reset-password.tsx` | Callback y actualización de contraseña | Creado |
| `src/app/auth/callback.tsx` | Callback de OAuth | Creado |
| `src/app/home.tsx` | Pantalla autenticada y cierre de sesión | Creado |
| `.env.example` | Plantilla sin credenciales | Actualizado |
| `eslint.config.js` | Configuración generada para habilitar lint | Creado |

## 8. ARCHIVOS MODIFICADOS

| Archivo | Modificación |
|---|---|
| `.gitignore` | Excluye archivos `.env` locales y permite conservar `.env.example`. |
| `README.md` | Documenta variables requeridas y configuración de redirect URLs para Supabase/Google. |
| `package.json`, `package-lock.json` | Añade Supabase, AsyncStorage, URL polyfill y dependencias de lint requeridas por el script existente. |
| `src/app/_layout.tsx` | Monta el proveedor de autenticación y registra el manejo de callback del navegador. |
| `src/app/index.tsx` | Restaura sesión y dirige al usuario al login o a la pantalla autenticada. |

## 9. CONFIGURACIONES EXTERNAS

### Supabase
- Proyecto creado: Pendiente de confirmar fuera del repositorio.
- URL configurada: Pendiente de confirmar.
- Auth configurado: Pendiente de habilitar/configurar Email en el dashboard.
- Google OAuth: Pendiente de habilitar y cargar credenciales en el dashboard de Supabase.
- Base de datos: Pendiente.
- RLS: Pendiente.

### Google Cloud
- Proyecto creado: Pendiente de confirmar.
- Client ID configurado: Pendiente.
- Client Secret configurado en Supabase: Pendiente; nunca debe guardarse en el frontend.
- URLs de redirección: Código utiliza `loginprofesional://auth/callback` y `loginprofesional://reset-password`; falta registrarlas y probarlas.

No guardar secretos ni credenciales reales.

## 10. PROBLEMAS ENCONTRADOS Y SOLUCIONES

- El chequeo TypeScript global también compila el directorio `example/`, cuyos imports apuntan a componentes que ya están eliminados en el worktree previo a esta tarea. Se verificaron los archivos de autenticación con una configuración temporal de alcance limitado, luego eliminada.
- El primer lint detectó actualizaciones de estado síncronas en efectos. Se refactorizaron los estados para derivar valores de props/contexto y el lint final pasó.
- `npm audit --omit=dev` reporta 7 advisories (4 moderados y 3 altos) en dependencias existentes de Expo/Expo Router. No se actualizaron SDK ni Router para evitar cambios de versión fuera del alcance.

## 11. HISTORIAL DE DESARROLLO

Registrar cronológicamente cada bloque completado.

### Bloque 1 - Autenticación mixta
- Estado: Implementación completada; integración externa pendiente.
- Descripción: Se añadieron las capas Domain, Data, Core y Presentation para login, registro, Google OAuth, recuperación/cambio de contraseña, persistencia de sesión y cierre de sesión.
- Validaciones: `npm run lint`, TypeScript acotado a `src/`, `npx expo export --platform web`, `npx expo export --platform android` y `npx expo install --check` pasaron.
- Integración end-to-end con Supabase/Google: Pendiente de credenciales de proyecto y configuración del dashboard.

## 12. SIGUIENTE BLOQUE

- **Bloque:** 1 - Configuración externa y prueba end-to-end.
- **Objetivo:** Configurar Supabase Email/Google y las URLs autorizadas; probar login, registro, recuperación, callbacks y persistencia en un development build.
- **Archivos involucrados:** `.env` local y dashboard de Supabase/Google Cloud.
- **Estado:** Pendiente; no marcar los flujos como verificados hasta probarlos.

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