# PRD: Demo Apps para Docker Compose con Múltiples Versiones de MongoDB

**Date**: 2026-04-17
**Mode**: co-creation
**Status**: completed

## Problem Statement

Los alumnos del curso de Docker necesitan aplicaciones reales (frontend + backend) que se conecten a las dos instancias de MongoDB levantadas con docker-compose (MongoDB 8 para m-flix y MongoDB 4.4 para airbnb). Actualmente el README explica docker-compose pero no hay apps que demuestren visualmente que la conexión funciona. Las apps deben ser visualmente atractivas pero con código mínimo — el foco es Docker, no el desarrollo web.

## User Stories

1. Como alumno, quiero levantar las bases de datos con `docker compose up -d` y ejecutar las apps con `npm start`, para ver que mis contenedores MongoDB funcionan correctamente.
2. Como alumno, quiero ver un listado de películas (m-flix) con poster, título, año y rating, para confirmar que la conexión a MongoDB 8 en puerto 27017 funciona.
3. Como alumno, quiero ver un listado de pisos de Airbnb con imagen, nombre, precio y tipo de propiedad, para confirmar que la conexión a MongoDB 4.4 en puerto 27018 funciona.
4. Como alumno, quiero poder filtrar películas por texto y pisos por tipo de propiedad, para interactuar mínimamente con la app.
5. Como alumno, quiero ver un mensaje amigable si no hay datos ("Ejecuta mongorestore..."), para saber qué hacer cuando la DB está vacía.
6. Como profesor, quiero que el código sea lo más simple posible, para que los alumnos no se distraigan del objetivo principal (Docker).

## Product / UX Decisions

- **Alcance visual**: Apps visualmente bonitas con Tailwind v4 + DaisyUI, una sola página por app — porque el foco es Docker, no SPA routing.
- **Estado vacío**: Mensaje amigable indicando que ejecuten mongorestore cuando no hay datos — porque los backups se cargan en clase manualmente.
- **Filtros**: Búsqueda por texto en m-flix, filtro por property_type en airbnb — suficiente interactividad sin complicar.
- **4 proyectos independientes**: 2 frontends + 2 backends separados (no monorepo) — porque cada uno demuestra la conexión a un MongoDB diferente.

## Technical Decisions

- **Backend framework**: Hono — alineado con el stack del curso según blueprints.
- **Frontend**: React + Vite + Tailwind v4 + DaisyUI — visualmente atractivo con mínimo esfuerzo.
- **Sin TanStack Router**: Una sola página, no necesita routing.
- **TypeScript + tsx**: Para el dev server del backend, según blueprints.
- **Oxlint + Prettier**: Linting y formato según blueprints.
- **Sin tests**: Demo de Docker, no merece la pena añadir tests.
- **Sin monorepo**: 4 proyectos independientes con su propio package.json.
- **Solo MongoDB dockerizado**: Front y back se ejecutan localmente con `npm start`.
- **Mappers camelCase**: Los datos de MongoDB usan snake_case en algunos campos; mapear a camelCase en los backends.
- **Variables de entorno**: Cada backend con `.env` conteniendo `MONGODB_URI`.

### Estructura de carpetas

```
01-inicio/
├── docker-compose.yml
├── frontend-mflix/
├── backend-mflix/
├── frontend-airbnb/
└── backend-airbnb/
```

### Puertos

| App             | Puerto |
| --------------- | ------ |
| frontend-mflix  | 8080   |
| backend-mflix   | 3000   |
| frontend-airbnb | 8081   |
| backend-airbnb  | 3001   |
| MongoDB mflix   | 27017  |
| MongoDB airbnb  | 27018  |

### Campos por colección

**movies (sample_mflix)** — Campos a usar:

- `_id`, `title`, `year`, `poster`, `plot`, `genres`, `imdb.rating`
- API model → camelCase

**listingsAndReviews (sample_airbnb)** — Campos a usar:

- `_id`, `name`, `summary`, `property_type`, `room_type`, `price`, `beds`, `bathrooms`, `images.picture_url`
- API model → camelCase (propertyType, roomType, pictureUrl, etc.)

### Endpoints

**backend-mflix (puerto 3000)**:

- `GET /api/movies?search=text` — listado con búsqueda opcional por título
- `GET /api/movies/:id` — detalle (opcional, solo si el front lo necesita)

**backend-airbnb (puerto 3001)**:

- `GET /api/listings?propertyType=X` — listado con filtro opcional por tipo
- `GET /api/listings/:id` — detalle (opcional)

## Testing Decisions

- Sin tests — es una demo de Docker, el código es desechable para los alumnos.

## Out of Scope

- Dockerfiles para front/back (solo se dockerizan las bases de datos)
- Monorepo / workspaces
- TanStack Router, Query u otras librerías complejas
- Autenticación
- Tests
- CI/CD
- Backups de datos (el profesor los gestiona en clase)
- Operaciones de escritura (solo lectura)

## Discarded Alternatives

- **Stack completo de blueprints (TanStack Router + Query)**: descartado porque añade complejidad innecesaria para una demo de Docker.
- **Un solo backend para ambas DBs**: descartado porque el usuario prefiere 4 proyectos separados para mayor claridad pedagógica.
- **Express en backend**: descartado a favor de Hono para alinearse con el stack del curso.
- **Apps en docker-compose**: descartado porque el foco es dockerizar solo las bases de datos.

## Assumptions

- Los datasets de MongoDB Atlas (sample_mflix, sample_airbnb) se restaurarán manualmente en clase con mongorestore.
- Los campos listados coinciden con los del dump real en `00-backups/`.
- Los alumnos tienen Node.js instalado localmente para ejecutar front y back.
- DaisyUI es compatible con Tailwind v4.

## Risks

- Los campos del BSON pueden no coincidir exactamente con lo asumido (no se pudieron leer directamente). Verificar tras mongorestore.
- DaisyUI + Tailwind v4 compatibilidad — DaisyUI 5 soporta Tailwind v4, verificar versión.

## Open Points

- [ ] Verificar campos exactos del BSON tras restaurar en clase
- [ ] Confirmar compatibilidad DaisyUI 5 + Tailwind v4

## Next Steps

- [ ] Run `prd-to-plan` to create implementation phases
