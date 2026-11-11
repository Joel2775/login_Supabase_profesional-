---
name: 03-ui-login
description: Implementación de un sistema visual moderno para medidoresAguaIA utilizando Uniwind, Claymorphism y múltiples animaciones Lottie funcionales.
---

# SKILL 11 — SISTEMA VISUAL CLAYMORPHISM + UNIWIND + LOTTIE

## 1. OBJETIVO PRINCIPAL

Implementar un rediseño visual moderno, profesional, atractivo e intuitivo para la aplicación móvil `medidoresAguaIA`, utilizando obligatoriamente:

- **Uniwind:** sistema principal de estilos mediante clases `className`.
- **Claymorphism:** identidad visual de toda la aplicación.
- **Lottie:** animaciones para representar estados reales y mejorar la experiencia del usuario.
- **React Native:** componentes nativos y funcionales.
- **TypeScript:** tipado estricto y componentes reutilizables.

El resultado debe parecer una aplicación comercial profesional para técnicos de una empresa de servicios de agua potable, no una aplicación académica básica.

**La prioridad máxima es la calidad visual de la interfaz, la consistencia del diseño y la integración real de las animaciones.**

No basta con instalar las librerías. Se debe implementar y comprobar su funcionamiento en las pantallas de la aplicación.

---

# 2. REGLAS OBLIGATORIAS DEL PROYECTO

Antes de modificar cualquier archivo:

1. Analizar toda la estructura existente.
2. Identificar las pantallas, componentes, navegación y funcionalidades actuales.
3. Revisar `package.json`, `app.json`, `metro.config.js`, `global.css` y configuraciones existentes.
4. Identificar las versiones instaladas de Expo, React Native y demás dependencias.
5. Revisar las animaciones Lottie que ya estén implementadas.
6. Identificar los componentes que pueden reutilizarse.

### Restricciones

- No crear otro proyecto Expo.
- No cambiar de Expo SDK 57 a SDK 58.
- No reemplazar Firebase, SQLite, MockAPI ni los servicios existentes.
- No modificar la lógica de autenticación, lecturas, mapas, GPS, sincronización o almacenamiento.
- No eliminar funcionalidades existentes.
- No duplicar componentes que ya cumplen la misma función.
- No reemplazar toda la navegación.
- No introducir NativeWind: el sistema solicitado es Uniwind.
- No utilizar `StyleSheet` como sistema principal de diseño.
- No crear componentes visuales que solamente sean decorativos y no funcionen.

Los cambios deben realizarse modularmente, preservando el comportamiento actual y efectuando únicamente las integraciones necesarias.

---

# 3. IDENTIDAD VISUAL: CLAYMORPHISM

La aplicación debe utilizar un diseño Claymorphism moderno.

No se debe confundir con colocar simplemente bordes redondeados y sombras.

Se debe conseguir una apariencia de superficies suaves, elevadas y tridimensionales.

### 3.1 Características visuales

Implementar:

- Tarjetas con profundidad visual.
- Sombras exteriores suaves.
- Superficies ligeramente elevadas.
- Bordes amplios y redondeados.
- Botones con apariencia táctil.
- Contenedores con efecto de volumen.
- Superficies internas ligeramente hundidas.
- Iluminación sutil.
- Separación visual entre niveles.
- Jerarquía tipográfica clara.
- Iconografía consistente.
- Espaciado equilibrado.

Evitar:
- Sombras negras excesivamente fuertes.
- Tarjetas demasiado recargadas.
- Demasiados colores compitiendo.
- Efectos 3D exagerados.
- Gradientes en absolutamente todos los componentes.
- Interfaces infantiles o caricaturescas.
- Textos demasiado pequeños.
- Elementos visuales que dificulten la lectura.

### 3.2 Paleta de colores

Utilizar la siguiente paleta como identidad de la aplicación:

| Color | Código | Uso |
|---|---|---|
| Rojo | #D92534 | Acciones importantes y alertas |
| Azul intenso | #0511F2 | Acciones principales |
| Azul oscuro | #263973 | Encabezados y elementos principales |
| Azul agua | #117DBF | Información y elementos relacionados con agua |
| Dorado | #D9B64E | Indicadores secundarios |
| Blanco | #FFFFFF | Superficies |
| Fondo claro | #F3F6FC | Fondo principal |
| Gris | #64748B | Información secundaria |

El azul debe predominar para representar el servicio de agua potable.

El rojo se utilizará únicamente para alertas, acciones destruct