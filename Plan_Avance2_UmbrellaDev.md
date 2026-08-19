# UmbrellaDev — Avance 2: Diagnóstico + Plan de 5 días

Revisé el repo (`github.com/Edo-ado/UmbrellaDev`, rama `main`) contra el documento **Avance 2**. Esto es lo que ya está sólido, lo que falta, y el orden en que lo vamos a atacar de hoy (miércoles noche) al lunes.

---

## 1. Diagnóstico real del repo (evidencia, no suposición)

### ✅ Ya está bien encaminado
- Arquitectura backend limpia: rutas → controladores → servicios, `StatusCodes`, `AppError`, middlewares de auth/error/validación.
- Login + registro con JWT reales (`usuarioController.login/register/perfil`), `auth.middleware.ts` existe.
- `AuthService` en Angular está **muy bien hecho**: signals, `inicializarSesion()`, `cargarPerfil()`, manejo de errores por status code. Esto no hay que tocarlo casi nada.
- `authGuard` y `roleGuard` **ya están escritos y correctos** — el problema es que no se usan en ningún lado todavía.
- Interceptor de token y de errores HTTP existen.
- Módulos CRUD de Avance 1 (Usuarios, Categorías, Especialidades, Servicios, Profesionales) están implementados con listado/detalle/crear/editar.
- El modelo `Resena` **ya existe en el schema de Prisma** (con relaciones a cliente/profesional/cita), solo que no tiene ni controlador, ni servicio, ni rutas, ni pantallas.
- Componente `agendavisual` ya existe como archivo, pero no está enrutado ni conectado a datos.
- `ng-apexcharts` funcionando en el dashboard "Centro de Vigilancia".

### 🔴 Brechas críticas (esto es lo que decide el 24% + 12% + 5% de la rúbrica)

**A. Estados de cita — el enum no coincide con el documento**
```
Actual:   PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA
Requiere: PENDIENTE, ACEPTADA, RECHAZADA, CANCELADA, COMPLETADA
```
`CitaServices.toggleStatus()` hoy es literalmente un switch binario Pendiente↔Confirmada. No hay Aceptar/Rechazar/Cancelar/Completar como acciones separadas, no hay motivo obligatorio, no hay validación de quién puede hacer qué transición.

**B. Faltan campos en el modelo `Cita`**
- No existe `Monto` (monto estimado que se guarda al crear la cita, para que cambios futuros en el precio del servicio no alteren citas ya creadas).
- No existe `MotivoCancelacion` / `MotivoRechazo`.
- No existe historial de estados (tabla `HistorialEstadoCita` con estado anterior, nuevo, fecha, motivo).

**C. `CitaServices.create()` no valida lo que pide el documento**
- No valida fecha futura.
- No valida traslape de horario del mismo profesional.
- No valida que el servicio esté activo ni que el profesional esté disponible.
- No calcula `HoraFin` a partir de la duración del servicio.
- No calcula/guarda el monto.

**D. Reseñas: 0% implementado en código funcional**
El modelo existe en Prisma pero no hay `resena.controller.ts`, `resena.service.ts`, `resena.routes.ts` en el backend, ni una sola pantalla en Angular. Esto vale 5% pero además es requisito para que el reporte de calificaciones tenga sentido.

**E. Reportes: no existen**
Solo existe `estadistica` (el dashboard de vigilancia con 3 gráficos). El documento pide 3 reportes específicos con filtros propios: citas por estado, citas por profesional, calificaciones. Nada de esto está construido (vale 4%, pero el reporte de calificaciones depende de reseñas).

**F. Control de acceso por rol: escrito pero no conectado (esto es grave — 12% de la rúbrica)**
`app.routes.ts` **no tiene ni un solo `canActivate`**. Todas las rutas están abiertas para cualquiera, autenticado o no. Tampoco existe la ruta `/sin-autorizacion`. El header (`header.html`) tiene un menú **estático** — todos los usuarios ven los mismos links, sin importar el rol. El documento prohíbe explícitamente "menú estático idéntico para todos los roles" y "protección basada únicamente en ocultar botones". Ahora mismo no hay ni lo uno ni lo otro: ni el menú cambia, ni las rutas están protegidas.

**G. Agenda visual: no enrutada**
El componente existe pero no aparece en `app.routes.ts`, así que hoy no es accesible. Falta además diferenciar vista por rol (cliente = historial, profesional = agenda propia, admin = agenda general con filtros).

**H. Seeders insuficientes contra la tabla de mínimos del documento**

| Entidad | Mínimo pedido | Lo que hay hoy | Problema |
|---|---|---|---|
| Usuarios | 10 (≥1 admin, ≥5 clientes, ≥4 profesionales, activos e inactivos) | 7 (2 admin, 4 profesionales, **1 solo cliente**), todos ACTIVO | Faltan clientes y usuarios inactivos |
| Servicios | 8 (activos e inactivos) | 4, todos activos | Faltan 4+ y variedad de estado |
| Citas | 5 (Pendiente, Aceptada, Rechazada, Cancelada, Completada; pasadas y futuras) | 12, pero **todas en PENDIENTE** | No hay variedad de estados |
| Reseñas | 3 | 0 | No existe seeding de reseñas |

**I. Nada de esto tiene que ver con Avance 1** — los módulos base están bien, así que la "Condición acumulativa" (10%) debería estar tranquila mientras no rompamos nada al tocar el menú/guards.

---

## 2. Prioridad según peso real de la rúbrica

| Sección | % | Estado |
|---|---|---|
| Gestión integral de citas | 24% | 🔴 Reescribir motor de estados |
| Usuarios/perfiles/categorías/especialidades/servicios | 18% | 🟡 Ya existe, hay que pulir validaciones y estados vacíos |
| Auth, sesión y control de acceso Frontend | 12% | 🔴 Guards no conectados, menú estático |
| Integración/permanencia Avance 1 | 10% | 🟢 Cuidar no romper nada |
| Calidad interfaz/validaciones/UX | 8% | 🟡 Revisar loading, confirmaciones, mensajes |
| Agenda visual | 8% | 🔴 No enrutada |
| Calidad técnica/código | 5% | 🟡 Ordenar `getByFechas` (try/catch pendiente) |
| Reseñas y calificaciones | 5% | 🔴 No existe |
| Reportes | 4% | 🔴 No existe |
| Defensa técnica | 6% | Se prepara al final |

Orden de ataque: **Citas → Roles/Guards/Menú → Agenda → Reseñas → Reportes → Seeders → Pulido/UX → Defensa.**

---

## 3. Plan día por día

### 🌙 Hoy, miércoles en la noche — Preparar el terreno (1–2h)
No es momento de escribir features grandes, es momento de dejar todo listo para rendir mañana.
1. Crear rama `feature/avance2` desde `main`.
2. Actualizar el enum `ESTADOCITA` en `schema.prisma` → `PENDIENTE, ACEPTADA, RECHAZADA, CANCELADA, COMPLETADA`.
3. Agregar al modelo `Cita`: `Monto Float?`, `MotivoCancelacion String?`, `MotivoRechazo String?`, `ComentarioAceptacion String?`.
4. Crear el modelo `HistorialEstadoCita` (EstadoAnterior, EstadoNuevo, Fecha, Motivo, CitaId, relación).
5. Correr `npx prisma migrate dev --name avance2_estados_cita`.
6. Anotar en un `TODO.md` del repo (o en `notas/`) la lista de la sección 1 de este documento para no perder el hilo entre sesiones.

Meta de la noche: que el schema y la migración ya existan, sin tocar todavía la lógica de servicios/controladores.

---

### 📅 Día 1 — Jueves: Motor de citas (backend completo)
Este es el bloque de mayor peso (24%), va primero.
1. Reescribir `cita.service.ts`:
   -   `solicitar()`: valida servicio activo, profesional disponible, fecha futura, calcula `HoraFin` desde duración, calcula y guarda `Monto` desde el precio actual del servicio, valida traslape (mismo profesional, mismo rango de horario), crea con estado `PENDIENTE`.
   - `aceptar(id, comentarioOpcional)`: solo si `PENDIENTE` → `ACEPTADA`.
   - `rechazar(id, motivo)`: motivo obligatorio, solo si `PENDIENTE` → `RECHAZADA`.
   - `cancelar(id, motivo, actorRol)`: reglas de la matriz del documento (Pendiente: cliente; Aceptada: cliente o profesional, motivo obligatorio).
   - `completar(id)`: solo si `ACEPTADA` y la fecha/hora programada ya pasó.
   - Cada transición inserta un registro en `HistorialEstadoCita`.
2. Separar en el controlador un endpoint por acción (`PATCH /citas/:id/aceptar`, `/rechazar`, `/cancelar`, `/completar`) en vez del `toggleStatus` genérico.
3. Arreglar `getByFechas` para que siga el patrón `try/catch` + `StatusCodes` del resto (el pendiente que ya tenías anotado para la defensa).
4. Endpoint `GET /citas/:id/historial`.
5. Probar todo con Postman antes de tocar el frontend (actualiza la colección Postman del repo).

---

### 📅 Día 2 — Viernes: Motor de citas (frontend) + Roles/Guards/Menú dinámico
**Mañana/tarde — Citas en Angular:**
1. Actualizar `cita.model.ts` con los nuevos estados y campos (`Monto`, `MotivoCancelacion`, etc.).
2. `registro.ts`: mostrar monto estimado antes de confirmar, deshabilitar servicios inactivos/profesionales no disponibles en los selects, deshabilitar botón de envío durante el submit.
3. `listado.ts`: botones de Aceptar/Rechazar/Cancelar/Completar según rol y estado actual (usar la matriz de transición como fuente de verdad de qué botones mostrar).
4. `detalle.ts`: mostrar historial de estados de la cita.
5. Modal simple para motivo obligatorio en Rechazar/Cancelar.

**Noche — Control de acceso (12% de la rúbrica, y es rápido con lo que ya existe):**
1. En `app.routes.ts`: envolver rutas con `canActivate: [authGuard]` y agregar `data: { roles: [...] }` + `canActivate: [roleGuard]` según la matriz de la sección 8 del documento (Admin/Profesional/Cliente).
2. Crear página `/sin-autorizacion` (simple, con botón de volver).
3. Hacer el header dinámico: inyectar `AuthService`, usar `@if (authService.esAdmin())` etc. para mostrar/ocultar secciones del menú según rol, y mostrar botón de Logout solo si `autenticado()`.
4. Verificar `/login` y `/register` no sean accesibles estando ya autenticado (opcional pero suma puntos de UX).

---

### 📅 Día 3 — Sábado: Agenda visual + Reseñas
**Mañana — Agenda visual:**
1. Enrutar `agendavisual` (`/agenda`), protegida por `authGuard`.
2. Endpoint(s) backend si faltan: `GET /citas/agenda?profesionalId=` o reutilizar `getByFechas`/`getByProfesional`.
3. Vista diferenciada por rol: cliente ve su historial cronológico, profesional ve su agenda con acciones, admin ve agenda general con filtros por fecha/profesional/estado.
4. Indicadores visuales por estado (colores/badges), loading, estado vacío.

**Tarde/noche — Reseñas:**
1. Backend: `resena.controller.ts`, `resena.service.ts`, `resena.routes.ts`. Reglas: solo cliente de una cita `COMPLETADA`, una reseña por cita, puntuación 1–5.
2. Endpoint para promedio de calificación por profesional.
3. Frontend: formulario de reseña accesible desde citas completadas sin reseña (en listado/detalle), mostrar reseñas en el perfil del profesional, distinguir "completada sin reseñar" vs "ya calificada".

---

### 📅 Día 4 — Domingo: Reportes + Seeders + Repaso de módulos Avance 1
**Mañana — Reportes (backend simple + frontend con agregación, siguiendo tu patrón ya establecido):**
1. Reporte de citas por estado: totales + porcentajes, filtros por rango de fecha/profesional/categoría.
2. Reporte de citas por profesional: total, completadas, % finalización (admin ve todos, profesional solo el suyo).
3. Reporte de calificaciones: promedio, cantidad de reseñas, mejor servicio calificado, servicios con baja calificación (define el umbral, ej. `< 3`, y documéntalo).
4. Todos con loading/error/vacío y actualización tras cambios.

**Tarde — Seeders (crítico para la defensa, sin esto no hay demo):**
1. Ampliar `seed.ts`:
   - Usuarios → 10+: agregar clientes hasta tener ≥5, marcar 2–3 usuarios como `INACTIVO`/`BANEADO`.
   - Servicios → 8+: agregar variedad de precio/duración/categoría/modalidad, algunos `INACTIVO`.
   - Citas → variar estados: incluir `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CANCELADA`, `COMPLETADA`, con fechas pasadas y futuras, y al menos un par con horarios cercanos para poder demostrar la validación de traslape.
   - Reseñas → 3+: sobre citas `COMPLETADA`, dejar al menos una completada sin reseña.
2. Correr `npx prisma db push`/`migrate reset` + seed completo desde cero para confirmar que el entorno se reconstruye sin ajustes manuales.

**Noche — Repaso de Avance 1:**
Recorrer Usuarios, Categorías, Especialidades, Profesionales, Servicios verificando: consumo real de API, formularios con validación visible, loading/estados vacíos, integración con el menú dinámico nuevo (que no se haya roto nada al meter los guards).

---

### 📅 Día 5 — Lunes: Pulido, README y defensa
1. Mañana: recorrer el checklist de "Restricciones y condiciones de no aceptación" del documento (página 12) una por una contra tu app real.
2. Actualizar `README.md`: requisitos, instalación, variables de entorno, migraciones, seeders, comandos — probarlo tú mismo desde cero como si fueras el evaluador.
3. Verificar `.env.example`, `.gitignore` (que no suba `node_modules`, `.env`, `dist`).
4. Grabar el video/evidencia si la docente lo pide.
5. Repasar mentalmente (o en voz alta) cómo explicarías: por qué se centralizó la agregación en frontend en vez de `groupBy`, la relación doble de `Cita` a `Usuario` con `@relation` nombrado, el workaround de `contrasena`/`Contraseña`, y ahora también: la matriz de transición de estados y por qué el guard de rol vive separado del componente visual.
6. Últimos commits organizados (no un solo commit gigante al final).

---

## 4. Cómo vamos a trabajar esto juntos
Como pediste, lo iremos manejando en partes. Te propongo que empecemos **ahora mismo con el schema de Prisma** (paso 2–4 de "hoy en la noche"): te paso el `schema.prisma` actualizado con el enum corregido, los campos nuevos en `Cita` y el modelo `HistorialEstadoCita`, listo para migrar. ¿Arrancamos con eso?
