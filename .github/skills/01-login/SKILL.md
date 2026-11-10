---
name: 01-login
description: Implementación completa de la Parte 1 del deber de autenticación mixta en Expo React Native utilizando Clean Architecture, Supabase Auth, Google OAuth, registro, inicio de sesión y recuperación de contraseña. Actualiza memory.md al finalizar.
---

# SKILL: PARTE 1 - AUTENTICACIÓN MIXTA CON SUPABASE Y GOOGLE

## 1. OBJETIVO

Implementar completamente la Parte 1 del deber de desarrollo móvil.

La aplicación debe permitir que el usuario:

1. Ingrese mediante correo electrónico y contraseña.
2. Cree una cuenta utilizando correo electrónico y contraseña.
3. Recupere su contraseña mediante correo electrónico.
4. Inicie sesión mediante su cuenta de Google utilizando Social Login (OAuth).
5. Regrese a la aplicación después de autenticarse con Google.
6. Mantenga su sesión iniciada hasta cerrar sesión.

La autenticación debe implementarse utilizando Supabase Auth.

La implementación debe respetar obligatoriamente Clean Architecture y las instrucciones generales establecidas en `AGENTS.md`.

## 2. LECTURA OBLIGATORIA ANTES DE COMENZAR

Antes de modificar cualquier archivo:

1. Leer `AGENTS.md` ubicado en la raíz del proyecto.
2. Leer `memory.md` ubicado en la raíz del proyecto.
3. Revisar la estructura real del proyecto.
4. Identificar las dependencias instaladas y sus versiones.
5. Identificar las configuraciones existentes de Supabase.
6. Verificar qué funcionalidades de autenticación ya están implementadas.

No volver a crear configuraciones o archivos que ya existan y funcionen correctamente.

Si hay implementaciones anteriores, reutilizarlas.

No modificar funcionalidades ajenas a esta parte del deber.

## 3. TECNOLOGÍAS OBLIGATORIAS

- Expo.
- React Native.
- TypeScript.
- Expo Router.
- Clean Architecture.
- Supabase Auth.
- Google OAuth 2.0 / OpenID Connect.
- Google Cloud Console.
- AsyncStorage para persistencia de sesión cuando corresponda.
- Expo Linking.
- Expo WebBrowser o Expo AuthSession, según el flujo OAuth seleccionado.

Mantener compatibilidad con la versión de Expo instalada.

Antes de instalar dependencias, comprobar su compatibilidad utilizando las herramientas de Expo.

No actualizar el SDK de Expo sin autorización.

## 4. ARQUITECTURA CLEAN OBLIGATORIA

Organizar la funcionalidad respetando las siguientes capas.

### PRESENTATION

Responsabilidades:

- Pantalla de login.
- Pantalla de registro.
- Pantalla de recuperación de contraseña.
- Pantalla de restablecimiento de contraseña.
- Componentes de formularios.
- Botón de Google.
- Validaciones visuales.
- Estados de carga.
- Mensajes de error y éxito.
- Hooks de presentación.

No realizar consultas directas a Supabase desde las pantallas.

### DOMAIN

Responsabilidades:

- Contrato del repositorio de autenticación.
- Entidades necesarias.
- Casos de uso.

Crear los casos de uso necesarios:

- SignIn.
- SignUp.
- SignInWithGoogle.
