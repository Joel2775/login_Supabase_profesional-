# Login profesional

Aplicación móvil con Expo Router, TypeScript y autenticación de Supabase.

## Preparar el entorno

1. Instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env` y completa `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` con la URL del proyecto y la clave pública de Supabase. Nunca uses una clave `service_role` en la aplicación.
3. En Supabase, habilita Email y configura la confirmación de correo según el flujo deseado.
4. En **Authentication → URL Configuration → Redirect URLs**, añade los callback URLs de la aplicación:
   - `loginprofesional://auth/callback`
   - `loginprofesional://reset-password`
   - Al probar con Expo Go, `Linking.createURL` genera un callback `exp://<IP-LAN>:<puerto>/--/auth/callback`. Añade la URL exacta que genera la app en esa ejecución; puede cambiar si cambia la IP o el puerto de Metro. Para pruebas repetibles, usa una development build con el scheme `loginprofesional` y registra sus callbacks estables.
5. Para Google, habilita el proveedor en **Authentication → Providers → Google**. Crea un cliente OAuth en Google Cloud y registra como URI de redirección autorizada la URL de callback que muestra Supabase (`https://<project-ref>.supabase.co/auth/v1/callback`). Guarda el Client ID y Client Secret únicamente en la configuración del proveedor de Supabase, nunca en la aplicación.
6. Ejecuta `npx expo start`. Expo Go sirve para pruebas, pero requiere permitir el callback `exp://` actual. Para probar OAuth en un dispositivo de forma repetible, usa una development build con el scheme `loginprofesional` declarado en `app.json`.

El cliente Supabase persiste la sesión mediante AsyncStorage y utiliza PKCE para OAuth y recuperación de contraseña. Al iniciar con Google se solicita mostrar el selector de cuentas (`prompt=select_account`); si Google ya tiene una sesión activa, puede permitir elegir una cuenta sin pedir su contraseña. Para cambiar una sesión ya abierta en la aplicación, primero cierra sesión. El flujo requiere que las URLs de redirección registradas en Supabase coincidan con las que usa la aplicación.

## Interfaz y animaciones

La interfaz utiliza Uniwind con Tailwind CSS 4. La hoja de estilos y los colores de la aplicación están centralizados en `src/global.css`, y Metro carga esa configuración desde `metro.config.js`. Las pantallas de autenticación y gestión académica comparten componentes visuales con superficies Claymorphism, fondos claros y la paleta azul del proyecto.

Las animaciones Lottie locales están en `assets/animations/` y se presentan mediante `src/presentation/components/lottie-state.tsx`: carga durante operaciones pendientes, éxito al completar acciones y error junto a mensajes de error. `@lottiefiles/dotlottie-react` habilita su renderizado en web. Ejecuta `npx expo start` para abrir la aplicación y `npx expo install --check` para revisar la compatibilidad de dependencias con Expo.

## Migraciones de la base académica

Los scripts versionados están en `supabase/migrations/` y se ejecutan en orden numérico (`001` a `005`). El usuario reporta que ya los ejecutó en su proyecto Supabase; el repositorio no tiene una verificación independiente del estado remoto. Comprueba en Supabase las tablas, políticas RLS y función RPC antes de considerarlas verificadas.
