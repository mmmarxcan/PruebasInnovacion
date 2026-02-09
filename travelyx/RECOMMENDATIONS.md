# Recomendaciones para Travelyx 🐙

¡El proyecto tiene una base visual excelente! La integración de "Polly" y el nuevo Dashboard de estadísticas le dan un toque muy profesional.

Tras revisar el código, aquí están mis recomendaciones técnicas para llevarlo al siguiente nivel (PRODUCCIÓN):

## 1. Persistencia de Datos (Prioridad Alta) 💾
Actualmente, el **Dashboard** y el **Formulario** no están conectados. Si agregas un restaurante, no aparece en la lista porque cada pantalla tiene sus propios datos "de prueba".
*   **Recomendación:** Crear un `RestaurantService`.
    *   Este servicio guardará la lista de restaurantes en memoria (o en `localStorage` para que no se borren al recargar).
    *   Así, cuando uses el formulario "Guardar", realmente se agregará a la lista del Dashboard.

## 2. Manejo de Imágenes (Experiencia Móvil) 📸
En el formulario usamos campos de texto para URLs de imágenes (`https://...`). Esto es incómodo en un celular.
*   **Recomendación:** Integrar **Capacitor Camera**.
    *   Permitirá al dueño del restaurante tomar una foto real de su platillo o elegirla de la galería.

## 3. Mapas Reales 🗺️
La vista de mapa es funcional pero básica.
*   **Recomendación:** Integrar **Google Maps SDK** o **Mapbox**.
    *   Para mostrar los pines exactos de los restaurantes registrados en el Dashboard.

## 4. Autenticación Real 🔐
El login actual es una simulación (cualquier usuario entra).
*   **Recomendación:** Integrar **Firebase Auth**.
    *   Para tener usuarios reales, recuperar contraseñas y asegurar que solo el dueño vea sus restaurantes.

---

### ¿Por dónde te gustaría continuar?
Mi sugerencia es empezar por el **Punto 1 (Servicio de Datos)** para que la app "funcione" de verdad y puedas registrar y ver tus restaurantes.
