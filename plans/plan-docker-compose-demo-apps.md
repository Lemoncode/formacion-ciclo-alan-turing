# Plan: Demo Apps para Docker Compose con Múltiples Versiones de MongoDB

> Source PRD: plans/prd-docker-compose-demo-apps-2026-04-17.md
> Date: 2026-04-17

## Architectural decisions

- **Structure**: 4 proyectos independientes en `01-basico/01-mongodb/04-docker-compose-multiples-versiones/01-inicio/`
- **Backend**: Hono + mongodb driver + tsx + TypeScript
- **Frontend**: React + Vite + Tailwind v4 + DaisyUI 5
- **Tooling**: Oxlint + Prettier en cada proyecto
- **Ports**: frontend-mflix:8080, backend-mflix:3000, frontend-airbnb:8081, backend-airbnb:3001, mongo-mflix:27017, mongo-airbnb:27018
- **Routes**: `GET /api/movies?search=` (mflix), `GET /api/listings?propertyType=` (airbnb)
- **Schema (API models)**:
  - Movie: `{ id, title, year, poster, plot, genres, imdbRating }`
  - Listing: `{ id, name, summary, propertyType, roomType, price, beds, bathrooms, pictureUrl }`
- **Auth**: none
- **No tests, no router, no monorepo**

## Carried from PRD

### Assumptions

- Datasets se restauran manualmente en clase con mongorestore
- Los alumnos tienen Node.js instalado localmente
- DaisyUI 5 es compatible con Tailwind v4

### Out of scope

- Dockerfiles para front/back
- Monorepo / workspaces
- TanStack Router, Query
- Autenticación, tests, CI/CD
- Backups de datos, operaciones de escritura

### Risks

- Campos del BSON pueden no coincidir exactamente — verificar tras mongorestore
- Compatibilidad DaisyUI 5 + Tailwind v4

---

## Phase 1: Infraestructura base + docker-compose

**Type**: AFK
**User stories**: US1
**Depends on**: none

### What to build

docker-compose.yml con dos servicios MongoDB (mongo:8 en 27017, mongo:4.4 en 27018) con volúmenes locales. Crear la estructura de carpetas vacía para los 4 proyectos. Añadir .gitignore para las carpetas de datos de MongoDB.

### Testing approach

Manual: `docker compose up -d` levanta ambos contenedores sin errores.

### Acceptance criteria

- [ ] docker-compose.yml arranca ambas instancias de MongoDB
- [ ] Carpetas mflix-data y airbnb-data se crean automáticamente
- [ ] .gitignore excluye las carpetas de datos

---

## Phase 2: Backend m-flix (tracer bullet)

**Type**: AFK
**User stories**: US2, US4, US5, US6
**Depends on**: Phase 1

### What to build

Proyecto Hono en `backend-mflix/`: conexión a MongoDB 8 (27017), endpoint GET /api/movies con búsqueda opcional por título, mapper de snake_case a camelCase, respuesta vacía amigable, env vars con MONGODB_URI. Tooling: tsx para dev, oxlint, prettier.

### Testing approach

Manual: curl al endpoint devuelve películas (con datos) o array vacío con mensaje (sin datos).

### Acceptance criteria

- [ ] `npm start` arranca el servidor en puerto 3000
- [ ] GET /api/movies devuelve listado de películas en camelCase
- [ ] GET /api/movies?search=batman filtra por título
- [ ] Sin datos en DB: respuesta con array vacío
- [ ] CORS habilitado para el frontend

---

## Phase 3: Frontend m-flix

**Type**: AFK
**User stories**: US2, US4, US5, US6
**Depends on**: Phase 2

### What to build

React SPA en `frontend-mflix/`: Vite + Tailwind v4 + DaisyUI. Una sola página con header, buscador de texto, grid de cards de películas (poster, título, año, rating por géneros). Estado vacío con mensaje amigable ("Ejecuta mongorestore..."). Fetch nativo al backend.

### Testing approach

Manual: abrir en navegador, ver listado, buscar, verificar estado vacío.

### Acceptance criteria

- [ ] `npm start` sirve la app en puerto 8080
- [ ] Muestra grid de películas con poster, título, año, rating
- [ ] Buscador filtra películas por texto
- [ ] Sin datos: muestra mensaje indicando ejecutar mongorestore
- [ ] Diseño atractivo con DaisyUI

---

## Phase 4: Backend airbnb (réplica adaptada)

**Type**: AFK
**User stories**: US3, US4, US5, US6
**Depends on**: Phase 1

### What to build

Proyecto Hono en `backend-airbnb/`: conexión a MongoDB 4.4 (27018), endpoint GET /api/listings con filtro opcional por propertyType, mapper camelCase, respuesta vacía amigable. Mismo patrón que backend-mflix adaptado.

### Testing approach

Manual: curl al endpoint devuelve listings o respuesta vacía.

### Acceptance criteria

- [ ] `npm start` arranca el servidor en puerto 3001
- [ ] GET /api/listings devuelve listado en camelCase
- [ ] GET /api/listings?propertyType=Apartment filtra por tipo
- [ ] Sin datos en DB: respuesta con array vacío
- [ ] CORS habilitado

---

## Phase 5: Frontend airbnb (réplica adaptada)

**Type**: AFK
**User stories**: US3, US4, US5, US6
**Depends on**: Phase 4

### What to build

React SPA en `frontend-airbnb/`: Vite + Tailwind v4 + DaisyUI. Una sola página con header, dropdown de filtro por property_type, grid de cards de pisos (imagen, nombre, precio, camas, tipo). Estado vacío amigable. Mismo patrón que frontend-mflix adaptado.

### Testing approach

Manual: abrir en navegador, ver listado, filtrar, verificar estado vacío.

### Acceptance criteria

- [ ] `npm start` sirve la app en puerto 8081
- [ ] Muestra grid de pisos con imagen, nombre, precio, tipo
- [ ] Dropdown filtra por tipo de propiedad
- [ ] Sin datos: muestra mensaje indicando ejecutar mongorestore
- [ ] Diseño atractivo con DaisyUI

---

## Dependency graph

```
Phase 1 ──→ Phase 2 ──→ Phase 3
       └──→ Phase 4 ──→ Phase 5
```

Phases 2-3 y 4-5 pueden ejecutarse en paralelo.
