# REPORTE DE PROCESOS Y FUNCIONALIDAD CLAVE: TRAVELYX

**OBJETIVO:** Describir detalladamente las funciones principales del sistema y analizar el flujo de sus procesos operativos integrales, cubriendo la interacción entre Turista, Empresario y Administración Central.

---

## 1. FUNCIONALIDAD CLAVE DEL SISTEMA 🔑

Travelyx opera como un ecosistema digital inteligente que conecta tres pilares fundamentales:

### A. Para el Turista (Usuario Final)
*   **Asistente Virtual "Polly":** Guía que personaliza la experiencia.
*   **Filtrado Inteligente:** Algoritmo que cruza *Antojo*, *Presupuesto* y *Ambiente*.
*   **Portabilidad (QR):** Permite llevar las preferencias en el celular y activarlas en cualquier kiosco.

### B. Para el Empresario (Restaurante)
*   **Gestión Comercial:** Control total de su menú y perfil digital.
*   **Inteligencia de Datos:** Dashboard con métricas reales de impacto (vistas/clics) para tomar decisiones.

### C. Para el Dueño del Software (Super Admin)
*   **Gestión Centralizada:** Panel maestro para administrar todas las cuentas de empresarios.
*   **Control de Monetización (Paywall):** Sistema de bloqueo instantáneo ("Kill Switch") que oculta a los restaurantes que no cumplen con los acuerdos económicos, incentivando el pago sin perder datos históricos.

---

## 2. DIAGRAMA DE FLUJO GENERAL DEL SISTEMA 🔄

El siguiente diagrama unificado representa la totalidad de las interacciones del sistema Travelyx.

```mermaid
graph TD
    %% --- Actores Empresario ---
    Admin((Empresario))
    DB[(Base de Datos)]
    
    %% --- Flujo Empresario ---
    Admin -->|1. Login| Login[Pantalla de Acceso]
    Login -->|Credenciales| Auth{Validación}
    
    Auth -- Error --> Login
    Auth -- Éxito --> Dashboard[Dashboard Principal]
    
    %% --- Acciones Principales Empresario ---
    Dashboard -->|Ver KPIs| Analytics[Analíticas: Vistas/Clics]
    Dashboard -->|Editar| Profile[Gestión de Perfil]
    
    %% --- Detalles de Gestión ---
    subgraph Acciones [Operaciones]
        direction TB
        Analytics -->|Optimizar| Decision((Toma de Decisiones))
        Profile -->|Subir Fotos| Update1[Actualizar Galería]
        Profile -->|Cambiar Precios| Update2[Actualizar Menú]
    end
    
    Update1 -->|Guardar| DB
    Update2 -->|Guardar| DB
    DB -->|Reflejar en App| AppUser[App del Usuario]
    
    %% Estilos Empresario
    classDef admin fill:#d1fae5,stroke:#059669,stroke-width:2px;
    class Admin,Dashboard,Analytics,Profile admin;

    %% --- Actores Turista ---
    User((Turista))
    System[Travelyx Kiosco]
    Messaging[WhatsApp / Telegram]
    
    %% --- Flujo Turista ---
    User -->|1. Inicia| Splash[Pantalla Bienvenida]
    Splash -->|2. Escaneo| HasQR{¿Tiene QR?}
    
    %% --- Flujo con QR (Usuario Recurrente) ---
    HasQR -->|Sí: Escanea| Decrypt[Decodificar QR]
    Decrypt -->|Carga Gustos| Home[Home: Recomendaciones]
    Home --> DB
    
    %% --- Flujo Sin QR (Usuario Nuevo) ---
    HasQR -->|No| Onboarding[Configurar Preferencias]
    Onboarding -->|Define Gustos| Home
    
    %% --- Experiencia Principal Turista ---
    Home -->|3. Selección| Detail[Ver Restaurante]
    Detail -->|4. Acción| Map[Ver Mapa / Ir]
    
    %% --- Cierre y Retención (NUEVO) ---
    Map -->|5. ¿Te gustó?| SavePrompt{¿Guardar Gustos?}
    
    %% --- Generación de QR ---
    SavePrompt -->|No| End((Fin Sesión))
    SavePrompt -->|Sí| GenerateQR[Generar QR Personalizado]
    GenerateQR -->|Envío| Messaging
    Messaging -->|Entregar| UserMobile[Celular del Usuario]
    GenerateQR --> End

     %% --- Actores SuperAdmin ---
    SuperAdmin((Dueño Software))
    AppTurista[App del Turista]
    
    %% --- Flujo SuperAdmin ---
    SuperAdmin -->|Login Maestro| Panel[Panel de Control General]
    
    %% --- Gestión de Clientes ---
    Panel -->|Ver Lista| Restaurants[Listado de Restaurantes]
    
    %% --- Proceso de Cobro/Bloqueo ---
    Restaurants -->|Revisar Estado| PaymentCheck{¿Pago al Día?}
    
    %% --- Acciones SuperAdmin ---
    PaymentCheck -- SÍ --> KeepActive[Mantener: ACTIVO]
    PaymentCheck -- NO --> BanAction[Acción: DESACTIVAR]
    
    %% --- Impacto en el Sistema ---
    KeepActive -->|Visible| DB
    
    
    DB -->|Actualización Inmediata| AppTurista
    
    %% --- Resultado Visual ---
    subgraph Resultado_en_App
        direction TB
        KeepActive -.->|Aparece en búsquedas| Visible((Visible))
        BanAction -.->|Desaparece del listado| Hidden((Invisible))
    end
    
    %% Estilos SuperAdmin
    classDef super fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    classDef action fill:#fee2e2,stroke:#ef4444,stroke-width:2px;
    class SuperAdmin,Panel,Restaurants,PaymentCheck super;
    class BanAction,Hidden action;
```

---

## 3. ANÁLISIS INTEGRAL DE LOS PROCESOS ⚙️

Este diagrama revela la **interconexión vital** del sistema Travelyx:

### I. La Base de Datos como Núcleo (Hub Central)
Observe cómo el nodo **DB [(Base de Datos)]** recibe información de tres fuentes distintas simultáneamente:
1.  **Del Empresario:** Información de menús y precios (`Update1`, `Update2`).
2.  **Del Turista:** Consultas para recomendaciones (`Home --> DB`).
3.  **Del Super Admin:** Estados de visibilidad (`KeepActive --> DB`).

### II. Flujo de Valor y Monetización
El sistema garantiza que el valor fluya en ambas direcciones, pero introduce un "cuello de botella" controlado por el Super Admin:
*   Si el empresario paga, el flujo `DB --> AppTurista` se mantiene abierto (Visible).
*   Si no paga, el flujo se corta (Invisible), protegiendo el modelo de negocio del software.

### III. Ciclo de Vida del Usuario (Retention Loop)
El diagrama del turista muestra claramente el ciclo de fidelización:
Inicio -> Experiencia (Valor) -> Generación de QR (Retención) -> Reingreso (Portabilidad).
Esto transforma a usuarios ocasionales en usuarios recurrentes, aumentando el valor de la plataforma para los restaurantes suscritos.
