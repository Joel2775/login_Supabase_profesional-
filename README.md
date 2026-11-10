# Login profesional

Aplicación móvil con Expo Router, TypeScript y autenticación de Supabase.

## Preparar el entorno

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env` y completa `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` con la URL del proyecto y la clave pública de Supabase. Nunca uses una clave `service_role` en la aplicación.
3. En Supabase, habilita Email y configura la confirmación de correo según el flujo deseado.
4. En **Authentication → URL Configuration**, añade los callback URLs de la aplicación:
   - `loginprofesional://auth/callback`
   - `loginprofesional://reset-password`
5. Para Google, habilita el proveedor en **Authentication → Providers → Google**. Crea un cliente OAuth en Google Cloud y registra como URI de redirección autorizada la URL de callback que muestra Supabase (`https://<project-ref>.supabase.co/auth/v1/callback`). Guarda el Client ID y Client Secret únicamente en la configuración del proveedor de Supabase, nunca en la aplicación.
6. Ejecuta `npx expo start`. Para probar OAuth en un dispositivo, usa una development build con el scheme `loginprofesional` declarado en `app.json`.

El cliente Supabase persiste la sesión mediante AsyncStorage y utiliza PKCE para OAuth y recuperación de contraseña. El flujo requiere que las URLs de redirección registradas en Supabase coincidan con las que usa la aplicación.

## Migraciones de la base académica

Los scripts versionados están en `supabase/migrations/` y se ejecutan en orden numérico (`001` a `005`). El usuario reporta que ya los ejecutó en su proyecto Supabase; el repositorio no tiene una verificación independiente del estado remoto. Comprueba en Supabase las tablas, políticas RLS y función RPC antes de considerarlas verificadas.
