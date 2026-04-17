# Laboratorio: Fullstack con Docker Compose

## ¿Qué vamos a hacer?

Tienes delante una aplicación **SeriesRank** ya construida: un ranking de series donde puedes votar y añadir tus favoritas.

- El **frontend** es una SPA con **Astro + TypeScript** organizada con PODS Architecture.
- El **backend** es una API REST con **Express + TypeScript**.
- La **base de datos** es **MySQL 8.0**.

El frontend y el backend corren en local (`npm run dev`). Tu misión es escribir el `docker-compose.yml` que levante **sólo la base de datos** con persistencia de datos.

---

## Estructura del proyecto

```
02-laboratorio-my-sql/
├── backend/              ← API Express + TypeScript (ya hecho)
│   ├── init.sql          ← Schema + datos de ejemplo
│   ├── package.json
│   ├── tsconfig.json
│   └── src/server.ts
├── frontend/             ← Astro + TypeScript — PODS Architecture (ya hecho)
│   ├── astro.config.ts   ← proxy /api → localhost:3000
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── layouts/
│       ├── pages/
│       └── pods/
│           └── series/   ← pod completo con api, mapper, business, components
├── mysql-data/           ← se crea sola al arrancar Docker (NO tocar)
└── docker-compose.yml    ← ESTO LO ESCRIBES TÚ
```

---

## Objetivos del laboratorio

- Entender qué partes de una aplicación tiene sentido Dockerizar
- Crear un servicio MySQL con persistencia de datos en local
- Montar el script de inicialización SQL para que la BD se cree sola
- Verificar que los datos sobreviven a un `docker compose down / up`

---

## Paso 1 — Instala las dependencias

Abre **dos terminales** y ejecuta esto antes de nada:

**Terminal 1 — Backend:**

```bash
cd backend
npm install
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm install
```

Espera a que ambos terminen antes de continuar.

---

## Paso 2 — Escribe el `docker-compose.yml`

Crea el fichero `docker-compose.yml` en la raíz del laboratorio (donde está este enunciado).

El compose sólo necesita **un servicio**: la base de datos. El frontend y el backend corren en local sin Docker.

---

### ¿Qué tiene que tener el servicio `db`?

| Qué necesitas configurar   | Pista                                                                    |
| -------------------------- | ------------------------------------------------------------------------ |
| Imagen de MySQL            | `mysql:8.0`                                                              |
| Contraseña de root         | Variable de entorno `MYSQL_ROOT_PASSWORD`                                |
| Nombre de la base de datos | Variable de entorno `MYSQL_DATABASE`                                     |
| Puerto expuesto al host    | `3306:3306` (host:contenedor)                                            |
| Dónde guardar los datos    | Bind mount: `./mysql-data:/var/lib/mysql`                                |
| Script de inicialización   | Bind mount: `./backend/init.sql:/docker-entrypoint-initdb.d/init.sql:ro` |

> 💡 **¿Qué es un bind mount?** Es una forma de decirle a Docker: "esta carpeta de mi ordenador (`./mysql-data`) es la misma que esta ruta del contenedor (`/var/lib/mysql`)". Todo lo que MySQL guarde dentro del contenedor aparecerá en tu carpeta local.

> 💡 **¿Qué es `/docker-entrypoint-initdb.d/`?** Es una carpeta especial de la imagen de MySQL. Cualquier fichero `.sql` que montes ahí **se ejecuta automáticamente la primera vez** que arranca el contenedor. Así la base de datos se crea sola.

---

### Pistas de sintaxis

<details>
<summary>Pista 1 — Estructura básica de un servicio</summary>

```yaml
services:
  nombre-del-servicio:
    image: nombre-imagen:version
    environment:
      VARIABLE: valor
    ports:
      - "puerto-host:puerto-contenedor"
    volumes:
      - ./carpeta-local:/ruta/dentro/contenedor
```

</details>

<details>
<summary>Pista 2 — Los valores que necesitas</summary>

- Contraseña root: `seriesrank123`
- Nombre de la BD: `seriesrank`
- Puerto: `3306`
- Carpeta de datos de MySQL dentro del contenedor: `/var/lib/mysql`

</details>

<details>
<summary>Pista 3 — El `:ro` del init.sql</summary>

El bind mount del script SQL lleva `:ro` al final (read-only). Eso evita que el contenedor pueda modificar tu fichero original:

```
./backend/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

</details>

---

## Paso 3 — Arranca la base de datos

Con el `docker-compose.yml` escrito, ejecuta esto desde la raíz del laboratorio:

```bash
docker compose up -d
```

La primera vez tardará un poco porque descarga la imagen de MySQL. Cuando termine, verifica que está corriendo:

```bash
docker compose ps
```

Deberías ver el contenedor en estado `Up`. Si ves errores, revisa los logs:

```bash
docker compose logs db
```

> 💡 Al arrancar por primera vez verás que se crea la carpeta `mysql-data/` en tu proyecto. Ahí es donde MySQL guarda todos sus datos en tu ordenador. **No la toques ni la borres**.

---

## Paso 4 — Arranca backend y frontend

Con la base de datos corriendo, arranca el resto:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

Deberías ver en la consola:

```
Conexión a base de datos establecida
Servidor arrancado en http://localhost:3000
```

Si ves un error de conexión, espera 10-15 segundos y vuelve a intentarlo. MySQL necesita unos segundos para arrancar por completo.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en el navegador. Deberías ver el ranking con las series de ejemplo.

> 💡 El `astro.config.ts` tiene un **proxy**: las peticiones del navegador a `/api/*` se redirigen automáticamente a `http://localhost:3000`. Por eso no tienes que configurar nada más.

---

## Paso 5 — Añade tus propias series

### Opción A — Desde la interfaz

Usa el formulario de la app para añadir al menos **3 series o animes** que recomendarías.

### Opción B — Directamente con SQL

Con el contenedor arriba, abre una shell de MySQL:

```bash
docker compose exec db mysql -u root -pseriesrank123 seriesrank
```

Y ejecuta:

```sql
INSERT INTO series (title, genre, year) VALUES
  ('One Piece',  'Anime / Aventura', 1999),
  ('Euphoria',   'Drama',            2019),
  ('Severance',  'Sci-Fi / Thriller', 2022);
```

---

## Paso 6 — Verifica la persistencia

Aquí está la parte importante: comprobar que los datos sobreviven cuando paras Docker.

**1. Para el contenedor:**

```bash
docker compose down
```

**2. Vuelve a levantarlo:**

```bash
docker compose up -d
```

**3.** Reinicia el backend (Ctrl+C y `npm run dev` otra vez) y recarga el navegador.

¿Siguen estando tus series? ✅ Eso es la persistencia.

> ⚠️ **Prueba también esto:** ejecuta `docker compose down` y luego **borra manualmente la carpeta `mysql-data/`**. Después haz `docker compose up -d`. ¿Qué ocurre? ¿Por qué?

---

## Cómo restaurar la base de datos desde cero

Si en algún momento rompes algo y quieres volver al estado inicial:

```bash
# 1. Para el contenedor
docker compose down

# 2. Borra la carpeta de datos (se perderán todos los cambios)
rm -rf mysql-data/

# 3. Vuelve a arrancar — el init.sql se ejecuta de nuevo automáticamente
docker compose up -d
```
