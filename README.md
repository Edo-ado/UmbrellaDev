# UmbrellaDev

Plataforma web para agendar citas con profesionales, organizados por categoría y especialidad. Los usuarios pueden explorar servicios, reservar citas y dejar reseñas; los profesionales publican sus servicios, gestionan disponibilidad y su perfil (foto, currículum, tarifas).

## ✨ Funcionalidades principales

- **Autenticación y roles** — JWT + Passport, con roles `ADMIN`, `USUARIO` y `DESARROLLADOR`.
- **Gestión de usuarios** — perfil de cliente o profesional (descripción, años de experiencia, tarifa base, ubicación, universidad, foto, currículum).
- **Categorías y especialidades** — catálogo jerárquico para clasificar servicios.
- **Servicios** — publicación de servicios por profesional, con precio, duración y modalidad (presencial, virtual, híbrida).
- **Citas** — agendamiento con estados (`PENDIENTE`, `CONFIRMADA`, `CANCELADA`, `COMPLETADA`) y filtros por fecha, profesional y estado.
- **Reseñas** — calificación y comentarios sobre citas completadas.
- **Imágenes** — subida y asociación de imágenes a usuarios y servicios (Multer).

## 🛠️ Stack utilizado

**Frontend (`/app`)**
- Angular 21 (standalone components, signals)
- Angular Material + Angular CDK
- TypeScript, RxJS

**Backend (`/api`)**
- Node.js + Express 5
- Prisma ORM (adaptador MariaDB/MySQL)
- Autenticación: JWT + Passport (local y JWT strategy)
- Validación de datos: Zod
- Logging: Winston (con rotación diaria de logs)
- Subida de archivos: Multer
- Documentación de endpoints: colección de Postman incluida (`UmbrellaDev.postman_collection.json`)

**Base de datos**
- MySQL/MariaDB, modelada con Prisma (migraciones versionadas en `api/prisma/migrations`)
- Modelos: `Usuario`, `Categoria`, `Especialidad`, `Servicio`, `Cita`, `Resena`, `Imagenes`, `Curriculum`, y tablas de relación para imágenes de usuario/servicio

## 🤖 Uso de IA

Usamos **Claude** y **ChatGPT** como apoyo en debugging (lectura de errores de TypeScript/Prisma, sugerencias de fixes) y generación de boilerplate (estructura inicial de controllers/services/routes siguiendo el patrón ya establecido en el proyecto). Además usamos **Claude** para apoyo en el diseño del frontend (estructura de componentes y estilos en Angular Material).

Todo el código generado con asistencia de IA fue revisado y ajustado manualmente antes de integrarlo: verificamos que los tipos de Prisma coincidieran con el schema real, que las rutas del frontend calzaran con los endpoints de Express, y adaptamos el boilerplate al patrón de arquitectura del proyecto (DTOs, middlewares de validación, manejo de errores centralizado).

## 📂 Estructura del proyecto

```
UmbrellaDev/
├── api/                  # Backend (Express + Prisma)
│   ├── src/
│   │   ├── controllers/  # Lógica de cada endpoint
│   │   ├── services/     # Lógica de negocio / acceso a datos
│   │   ├── routes/       # Definición de rutas por recurso
│   │   ├── dtos/         # Validación de payloads (Zod)
│   │   ├── middlewares/  # Auth, manejo de errores, validación
│   │   └── config/       # Prisma client, logger
│   └── prisma/
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.ts
└── app/                  # Frontend (Angular)
    └── src/app/
        ├── core/         # Servicios y modelos compartidos
        ├── layout/       # Header, footer, layout principal
        ├── pages/        # Vistas: usuarios, servicios, citas, categorías, especialidades, profesionales, panel-control
        └── shared/       # Componentes reutilizables
```

## 🚀 Instalación y ejecución local

### Requisitos previos
- Node.js 18+
- Una base de datos MySQL/MariaDB accesible

### 1. Clonar el repositorio
```bash
git clone https://github.com/Edo-ado/UmbrellaDev.git
cd UmbrellaDev
```

### 2. Backend (`/api`)
```bash
cd api
npm install
```

Crear un archivo `.env` en `api/` con:
```
DATABASE_URL="mysql://usuario:password@localhost:3306/umbrelladev"
JWT_SECRET="tu_secreto_aqui"
PORT=3000
```

Aplicar migraciones y (opcionalmente) poblar la base de datos:
```bash
npx prisma migrate dev
npx prisma generate
npx ts-node prisma/seed.ts   # datos de prueba
```

Levantar el servidor en modo desarrollo:
```bash
npm run dev
```

### 3. Frontend (`/app`)
```bash
cd app
npm install
npm start
```

La app queda disponible en `http://localhost:4200` y consume la API en `http://localhost:3000`.

## 📡 API — endpoints principales

| Recurso | Ejemplos de rutas |
|---|---|
| Categorías | `GET /categorias`, `GET /categorias/buscar?nombre=` |
| Especialidades | `GET /especialidades`, `GET /especialidades/estado/:estado` |
| Usuarios | `GET /usuarios`, `GET /usuarios/desarrolladores`, `GET /usuarios/rol/:rol` |
| Servicios | `GET /servicios`, `GET /servicios/rango-precio?precioMin=&precioMax=` |
| Citas | `GET /citas`, `GET /citas/fechas?fechaInicial=&fechaFinal=` |
| Imágenes | Subida y asociación a usuarios/servicios |

Colección completa de Postman disponible en la raíz del repo (`UmbrellaDev.postman_collection.json`).

## 👥 Autores

Proyecto desarrollado en conjunto por [Ash](https://github.com/) y [Edo](https://github.com/Edo-ado).
