# Laboratorio: Fullstack con Docker Compose

## ¿Qué vamos a hacer?

Tienes delante una aplicación **SeriesRank** ya construida: un ranking de series donde puedes votar y añadir tus favoritas.

- El **frontend** es una SPA con **Astro + TypeScript** organizada con PODS Architecture.
- El **backend** es una API REST con **Express + TypeScript**.
- La **base de datos** es **MySQL 8.0**.

El frontend y el backend corren en local (`npm run dev`). Tu misión es escribir el `docker-compose.yml` que levante **sólo la base de datos** con un volumen de persistencia.

```
┌──────────────────────────────────────────────────────────────┐
│                       Tu ordenador                           │
│                                                              │
│  Navegador ──► :4321 ──► Frontend Astro (npm run dev)        │
│                               │ proxy /api/* (Vite)          │
│                               ▼                              │
│                      Backend Express (npm run dev)           │
│                          :3000                               │
│                               │                              │
│                               ▼                              │
│                  ┌────────────────────────┐                  │
│                  │  Contenedor Docker: db │                  │
│                  │     MySQL 8.0  :3306   │                  │
│                  └───────────┬────────────┘                  │
│                              │ monta                         │
│                  ┌───────────▼────────────┐                  │
│                  │  Volumen: seriesrank-data│                 │
│                  └────────────────────────┘                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Estructura del proyecto

```
03-laboratorio-fullstack-docker/
├── app/
│   ├── backend/              ← API Express + TypeScript (ya hecho)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/server.ts
│   ├── db/
│   │   └── init.sql          ← Schema + datos de ejemplo
│   └── frontend/             ← Astro + TypeScript — PODS Architecture (ya hecho)
│       ├── astro.config.ts   ← proxy /api → localhost:3000
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── layouts/
│           ├── pages/
│           └── pods/
│               └── series/   ← pod completo con api, mapper, business, components
└── docker-compose.yml        ← 👈 ESTO LO ESCRIBES TÚ
```

---

## Objetivos del laboratorio

- Entender qué partes de una aplicación tienen sentido Dockerizar
- Crear un servicio MySQL con **volumen con nombre** para persistencia
- Montar el script de inicialización SQL con un **bind mount**
- Verificar que los datos sobreviven a un `docker compose down / up`

---

## Prerequisitos

Antes de empezar, instala las dependencias en local:

```bash
# Terminal 1 — Backend
cd app/backend
npm install

# Terminal 2 — Frontend
cd app/frontend
npm install
```

---

## Parte 1 — Escribe el `docker-compose.yml`

Crea el fichero `docker-compose.yml` en la raíz del laboratorio.

El compose sólo necesita **un servicio**: la base de datos. El frontend y el backend corren en local sin Docker.

---

### Servicio `db` — Base de datos MySQL

| Configuración                   | Valor                                                       |
| ------------------------------- | ----------------------------------------------------------- |
| Imagen                          | `mysql:8.0`                                                 |
| Variable `MYSQL_ROOT_PASSWORD`  | `seriesrank123`                                             |
| Variable `MYSQL_DATABASE`       | `seriesrank`                                                |
| Puerto expuesto al host         | `3306:3306`                                                 |
| Volumen de datos (named volume) | `seriesrank-data:/var/lib/mysql`                            |
| Bind mount init SQL             | `./app/db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro` |
| Health check                    | `mysqladmin ping`                                           |

> 💡 El bind mount con `:ro` (read-only) monta el SQL de inicialización. MySQL ejecuta automáticamente los ficheros de `/docker-entrypoint-initdb.d/` la primera vez que arranca.

<details>
<summary>Pista: health check</summary>

```yaml
healthcheck:
  test:
    [
      "CMD",
      "mysqladmin",
      "ping",
      "-h",
      "localhost",
      "-u",
      "root",
      "-pseriesrank123",
    ]
  interval: 10s
  timeout: 5s
  retries: 10
  start_period: 30s
```

</details>

### Volumen con nombre

Al final del fichero declara el volumen:

```yaml
volumes:
  seriesrank-data:
```

---

## Parte 2 — Cómo se crea y restaura la base de datos

### Creación automática (primera vez)

Cuando arrancas el contenedor por primera vez, MySQL ejecuta automáticamente todos los ficheros `.sql` que encuentre en `/docker-entrypoint-initdb.d/`. El compose monta `./app/db/init.sql` en esa carpeta, así que la base de datos **se crea y se puebla sola** sin que tengas que hacer nada más.

> ⚠️ Esto **solo ocurre una vez**: cuando el volumen está vacío. Si el volumen ya existe con datos, MySQL ignora esa carpeta.

### Restaurar la base de datos desde cero

Si necesitas volver al estado inicial (por ejemplo, has borrado datos y quieres empezar de nuevo):

```bash
# 1. Para el contenedor Y borra el volumen (pierdes todos los datos)
docker compose down -v

# 2. Vuelve a arrancarlo — el init.sql se ejecuta de nuevo automáticamente
docker compose up -d
```

### Arrancar la base de datos (uso normal)

```bash
docker compose up -d
```

Espera a que el health check sea `healthy`:

```bash
docker compose ps
```

Deberías ver algo como:

```
NAME      STATUS
db        Up (healthy)
```

---

## Parte 3 — Arranca backend y frontend

Abre **dos terminales**:

**Terminal 1 — Backend:**

```bash
cd app/backend
npm run dev
```

Deberías ver:

```
✅ Conexión a base de datos establecida
🚀 Servidor arrancado en http://localhost:3000
```

**Terminal 2 — Frontend:**

```bash
cd app/frontend
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en el navegador.

> 💡 ¿Por qué funciona sin configurar nada? El `astro.config.ts` tiene un **proxy Vite**: las peticiones del navegador a `/api/*` se redirigen automáticamente a `http://localhost:3000/api/*`.

---

## Parte 4 — Añade tus propias series

### Opción A — Desde la interfaz

Usa el formulario de la app para añadir al menos **3 series o animes** que tú recomendarías.

### Opción B — Directamente con SQL

Con el contenedor arriba:

```bash
docker compose exec db mysql -u root -pseriesrank123 seriesrank
```

```sql
INSERT INTO series (title, genre, year) VALUES
  ('One Piece',  'Anime / Aventura', 1999),
  ('Euphoria',   'Drama',            2019),
  ('Severance',  'Sci-Fi / Thriller', 2022);
```

---

## Parte 5 — Verifica la persistencia

1. Para el contenedor de MySQL:

```bash
docker compose down
```

2. Vuelve a levantarlo:

```bash
docker compose up -d
```

3. Reinicia el backend (se reconecta sólo) y recarga el navegador. ¿Siguen estando tus series? ✅

> ⚠️ Prueba también `docker compose down -v`. ¿Qué diferencia hay?

---

## Checklist de entrega

- [ ] El fichero `docker-compose.yml` existe en la raíz del laboratorio
- [ ] `docker compose up -d` arranca MySQL sin errores
- [ ] El ranking se ve en `http://localhost:4321`
- [ ] Al hacer `docker compose down` y `docker compose up -d` los datos siguen ahí
- [ ] El volumen `seriesrank-data` aparece en `docker volume ls`
- [ ] Se han añadido al menos 3 series nuevas

---

## Bonus (opcional)

- Añade un `restart: unless-stopped` al servicio `db`
- ¿Qué tipo de volumen usarías en producción? ¿Qué diferencia hay entre un named volume y un bind mount?
- Intenta conectarte a MySQL desde TablePlus o DBeaver usando `localhost:3306` mientras el contenedor está corriendo

---

## Referencia rápida

| Comando                       | Para qué sirve                                         |
| ----------------------------- | ------------------------------------------------------ |
| `docker compose up -d`        | Arrancar en background                                 |
| `docker compose down`         | Parar y eliminar contenedores (volúmenes se conservan) |
| `docker compose down -v`      | Parar + eliminar contenedores **y volúmenes**          |
| `docker compose ps`           | Ver estado y health de servicios                       |
| `docker compose logs -f db`   | Ver logs de MySQL en tiempo real                       |
| `docker compose exec db bash` | Abrir una shell en el contenedor db                    |
| `docker volume ls`            | Listar volúmenes de Docker                             |
