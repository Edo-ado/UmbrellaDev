# UmbrellaDev

UmbrellaDev es una plataforma web para conectar clientes con profesionales de distintas categorías y especialidades. El flujo principal es: un usuario se registra o inicia sesión, consulta profesionales y servicios, solicita una cita, y el profesional puede aceptar, rechazar, cancelar o completar esa cita. Después de completarla, el cliente puede dejar una reseña. Los profesionales pueden administrar su perfil, disponibilidad y servicios; la aplicación también incluye vistas administrativas y reportes.

El repositorio contiene una SPA en Angular y una API REST en Express que persiste la información en MySQL/MariaDB mediante Prisma.

## Estado actual

El flujo de autenticación, perfiles, servicios, citas, reseñas, imágenes, catálogos y algunas estadísticas está implementado en el código. El proyecto se encuentra en desarrollo: no hay un despliegue ni una configuración de producción documentados en este repositorio, y la cobertura y configuración de pruebas no representan un contrato completo de la API.

La autorización del frontend usa guards por rol, pero en la API la mayoría de rutas no tiene un middleware de autenticación o autorización asociado. Las rutas protegidas explícitamente son `GET /usuarios/perfil` y los dos reportes de estadísticas. Por tanto, los guards del frontend no deben considerarse un sustituto de autorización en el servidor.

## Flujo funcional

- **Acceso:** `POST /usuarios/register` registra un usuario y `POST /usuarios/login` valida sus credenciales y devuelve un JWT. El frontend guarda el token en `localStorage` y lo envía como `Authorization: Bearer TOKEN`.
- **Descubrimiento:** se consultan categorías, especialidades, profesionales y servicios, con filtros por nombre, estado, rol, modalidad, disponibilidad, categoría y rango de precio.
- **Citas:** un cliente solicita una cita para un servicio; la cita puede pasar por `PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `CANCELADA` y `COMPLETA`. También existe historial de cambios de estado en el modelo de datos.
- **Reputación:** las reseñas se relacionan con una cita, cliente y profesional, y se puede consultar el promedio de calificación.
- **Gestión:** el frontend incluye vistas de perfiles, servicios, agenda visual, panel general y gráficos. El acceso a varias vistas se restringe en Angular a `ADMIN`, `USUARIO` o `DESARROLLADOR`.

## Arquitectura y stack

### Frontend (`app/`)

- Angular 21 con componentes standalone y TypeScript.
- RxJS para flujos HTTP y asincrónicos; Angular signals y `computed` para el estado de sesión y estado reactivo de componentes.
- Angular Router con `authGuard` y `roleGuard`.
- Angular Material y Angular CDK para la interfaz.
- `HttpClient`, interceptor de autenticación e interceptor de errores.
- ApexCharts/ng-apexcharts para las vistas de gráficos.

La URL de la API se configura actualmente en `app/src/environments/environment.ts` y `environment.development.ts` como `http://localhost:3000`; la URL pública de imágenes es `http://localhost:3000/images`.

### Backend (`api/`)

- Node.js, Express 5 y TypeScript.
- Prisma 7 con `@prisma/adapter-mariadb` para MySQL/MariaDB.
- `bcryptjs` para hash de contraseñas y `jsonwebtoken` para emitir y verificar JWT.
- Passport, `passport-jwt` y `passport-local` aparecen como dependencias, pero las rutas actuales usan un middleware propio (`auth.middleware.ts`) basado directamente en `jsonwebtoken`; no se observa una estrategia Passport registrada y conectada al servidor.
- Zod y DTOs para definir reglas de entrada. Existe `validateRequest`, aunque actualmente no está conectado a las rutas en `src/routes`.
- Multer para recibir imágenes, `cors` y `morgan` para CORS y logging HTTP.
- Winston con `winston-daily-rotate-file` para logs diarios en `api/logs/`.

### Base de datos

El schema de Prisma define, entre otros, los modelos `Usuario`, `Categoria`, `Especialidad`, `Servicio`, `Cita`, `HistorialEstadoCita`, `Resena`, `Imagenes`, `ImagenesUsuario`, `ImagenesServicio` y `Curriculum`. Los roles son `ADMIN`, `USUARIO` y `DESARROLLADOR`; los servicios usan las modalidades `PRESENCIAL`, `VIRTUAL` y `HIBRIDA`; las citas usan los estados indicados arriba.

## Estructura relevante

```text
UmbrellaDev/
├── api/
│   ├── src/
│   │   ├── config/          # Cliente Prisma y logger
│   │   ├── controllers/     # Adaptación HTTP
│   │   ├── dtos/            # Schemas y tipos Zod
│   │   ├── middlewares/     # JWT, Multer y manejo de errores
│   │   ├── routes/          # Rutas por recurso
│   │   ├── services/        # Lógica de negocio y persistencia
│   │   └── server.ts        # Configuración y arranque de Express
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── package.json
├── app/
│   ├── src/app/
│   │   ├── core/            # Modelos, guards, interceptors y servicios
│   │   ├── layout/          # Layout, header y footer
│   │   ├── pages/           # Auth, perfiles, servicios, citas y paneles
│   │   └── shared/          # Componentes reutilizables
│   └── package.json
└── UmbrellaDev.postman_collection.json
```

## Configuración y ejecución local

### Requisitos

- Node.js compatible con las versiones declaradas en los `package.json` (el frontend usa Angular CLI 21).
- MySQL o MariaDB accesible desde el backend.

### 1. Clonar e instalar

```bash
git clone https://github.com/Edo-ado/UmbrellaDev.git
cd UmbrellaDev
```

En terminales separadas:

```bash
cd api
npm install
```

```bash
cd app
npm install
```

### 2. Variables de entorno del backend

Crear `api/.env`. El cliente Prisma utilizado por la aplicación necesita las variables de conexión separadas; Prisma CLI además lee `DATABASE_URL` desde `prisma.config.ts`.

```dotenv
DATABASE_HOST=localhost
DATABASE_USER=tu_usuario
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=umbrelladev
DATABASE_URL="mysql://tu_usuario:tu_contraseña@localhost:3306/umbrelladev"
JWT_SECRET=define_un_secreto_local
PORT=3000
NODE_ENV=development
```

`PORT` es opcional y por defecto vale `3000`. `NODE_ENV` controla, entre otras cosas, el detalle de errores no controlados. No se deben commitear contraseñas, tokens ni archivos `.env`.

### 3. Migraciones, cliente y seed

Desde `api/`, con la base de datos creada:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

El seed está definido en `prisma.config.ts` y ejecuta `tsx prisma/seed.ts`. Para crear una nueva migración durante el desarrollo:

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

### 4. Arrancar

```bash
# api/
npm run dev
```

```bash
# app/
npm start
```

La API queda en `http://localhost:3000` y la aplicación Angular en `http://localhost:4200`. El servidor expone las imágenes locales mediante `/images`.

Otros scripts disponibles:

```bash
# api/
npm run build
npm start

# app/
npm run build
npm test
```

## API REST disponible

Todas las rutas parten de la raíz de la API (no existe un prefijo `/api`).

| Recurso | Rutas implementadas |
| --- | --- |
| Raíz | `GET /` (mensaje y listado parcial de rutas) |
| Usuarios | `POST /usuarios/crear`, `PUT /usuarios/update/:id`, `PATCH /usuarios/CambioEstado/:id`, `GET /usuarios/lista`, `GET /usuarios/rol/:rol`, `GET /usuarios/modalidad/:modalidad`, `GET /usuarios/disponibilidad/:disponibilidad`, `GET /usuarios/buscar`, `GET /usuarios/Id/:id`, `GET /usuarios/desarrolladores`, `GET /usuarios/desarrolladoresDisponibles`, `GET /usuarios/fechas`, `PATCH /usuarios/CambioDisponibilidad/:id`, `POST /usuarios/login`, `POST /usuarios/register`, `GET /usuarios/perfil`, `GET /usuarios/perfil/:id`, `PATCH /usuarios/cambiar-rol/:id` |
| Categorías | `GET /categorias`, `GET /categorias/id/:id`, `GET /categorias/buscar`, `GET /categorias/estado/:estado`, `GET /categorias/activos`, `PATCH /categorias/CambioEstado/:id` |
| Especialidades | `GET /especialidades`, `GET /especialidades/id/:id`, `GET /especialidades/buscar`, `GET /especialidades/estado/:estado`, `GET /especialidades/activos`, `PATCH /especialidades/CambioEstado/:id` |
| Servicios | `GET /servicios`, `GET /servicios/id/:id`, `GET /servicios/profesional/:id`, `GET /servicios/categoria/:id`, `GET /servicios/buscar`, `GET /servicios/modalidad/:modalidad`, `GET /servicios/rango-precio`, `GET /servicios/activos`, `GET /servicios/filtrados`, `GET /servicios/profesional-activo/:id`, `POST /servicios/crear`, `PUT /servicios/update/:id`, `PATCH /servicios/CambioEstado/:id` |
| Citas | `GET /citas`, `GET /citas/id/:id`, `GET /citas/Profesional/:id`, `GET /citas/fechas`, `GET /citas/estado/:estado`, `POST /citas/solicitar`, `POST /citas/aceptar/:id`, `POST /citas/rechazar/:id`, `POST /citas/cancelar/:id`, `POST /citas/completar/:id`, `POST /citas/dejarreseña/:id`, `GET /citas/categorias` |
| Reseñas | `GET /resenas/profesional/:profesionalId`, `GET /resenas/id/:id`, `GET /resenas/detalle/:id`, `POST /resenas/dejarResena`, `GET /resenas/promedio/:idProfesional`, `GET /resenas/porCita/:citaId` |
| Imágenes | `POST /images/upload`, `GET /images/files`, `GET /images/download/:name` y archivos estáticos en `/images/<nombre>` |
| Estadísticas | `GET /estadisticas/citas-por-estado`, `GET /estadisticas/reporte-profesional`, `GET /estadisticas/reporte-calificaciones` |

Los nombres y mayúsculas de las rutas son los definidos actualmente en Express. La colección `UmbrellaDev.postman_collection.json` contiene ejemplos adicionales de consumo.

## Autenticación, autorización y errores

`POST /usuarios/login` genera un JWT con `Id`, `Email` y `Role`. `authenticateToken` exige el encabezado Bearer, verifica la firma con `JWT_SECRET` y rechaza tokens ausentes, mal formados, inválidos o expirados. El frontend restaura la sesión leyendo el identificador del payload, pero la verificación de la firma la realiza el backend.

Las contraseñas se procesan con `bcryptjs`. La API devuelve respuestas con `success`, `message` y, en algunos casos, `data`. El servidor registra peticiones con Morgan y tiene configuración de Winston para logs rotativos; el arranque actual también conserva un handler inline que escribe errores en la consola. Existe `ErrorMiddleware` para errores controlados y no controlados, pero no está conectado explícitamente en `server.ts`. La API responde con `400`, `401` o `500` según el caso. El middleware Zod transforma los errores de validación en una respuesta de solicitud inválida con detalle por campo cuando se utiliza explícitamente.

## Imágenes

Multer guarda los archivos en `api/assets/uploads` y genera nombres únicos. Solo se aceptan JPG, JPEG, PNG y WEBP, con un máximo de 2 MB; el campo multipart esperado es `image`. `PUT /usuarios/update/:id` puede recibir la imagen del perfil y `POST /images/upload` permite subirla directamente. Los archivos se sirven desde `/images`.

## Limitaciones conocidas

- No hay paginación, versionado de API ni documentación OpenAPI integrada; la colección de Postman es la referencia de ejemplos.
- La protección de rutas y los roles están aplicados de forma desigual: el frontend restringe vistas, pero la API no aplica autorización por rol de forma global.
- Hay schemas Zod y un middleware de validación, pero su uso no está conectado actualmente en los archivos de rutas; se debe revisar la validación efectiva de cada endpoint antes de un despliegue.
- El fallback del código para `JWT_SECRET` permite un secreto por defecto si falta la variable; en producción se debe configurar un secreto fuerte y obligatorio.
- El almacenamiento de imágenes es local al proceso/servidor; no hay evidencia en el repositorio de almacenamiento externo, antivirus, compresión o un flujo de eliminación de archivos huérfanos.
- Las pruebas existentes son principalmente specs del frontend; no se documenta una suite de integración o contrato para todos los endpoints del backend.

## Autores

Proyecto desarrollado en conjunto por [Ash](https://github.com/) y [Edo](https://github.com/Edo-ado).
