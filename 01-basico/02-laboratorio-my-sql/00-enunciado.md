# Laboratorio: Fullstack con Docker Compose

## ¿Qué vamos a hacer?

Tienes delante una aplicación **SeriesRank** ya construida: un ranking de series donde puedes votar y añadir tus favoritas.

- El **frontend** es una SPA con **Astro + TypeScript** organizada con PODS Architecture.
- El **backend** es una API REST con **Express + TypeScript**.
- La **base de datos** es **MySQL 8.0**.

El frontend y el backend corren en local con `npm run dev`. Tu misión es escribir el `docker-compose.yml` que levante **únicamente la base de datos** con persistencia de datos.

---

## Estructura del proyecto

```
02-laboratorio-my-sql/
├── backend/              ← API Express + TypeScript (ya hecho)
│   ├── init.sql          ← Schema + datos de ejemplo
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts
├── frontend/             ← Astro + TypeScript — PODS Architecture (ya hecho)
│   ├── astro.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── layouts/
│       ├── pages/
│       └── pods/
│           └── series/
├── mysql-data/           ← se crea sola al arrancar Docker
└── docker-compose.yml    ← ESTO LO ESCRIBES TÚ
```

---

## Objetivos del laboratorio

- Entender qué partes de una aplicación tiene sentido Dockerizar.
- Crear un servicio MySQL con persistencia de datos en local.
- Montar el script de inicialización SQL para que la base de datos se cree automáticamente al arrancar.
- Verificar que los datos sobreviven a un ciclo `docker compose down` / `docker compose up`.

---

## Paso 1 — Instala las dependencias

Instala las dependencias del backend y del frontend antes de continuar.

---

## Paso 2 — Escribe el `docker-compose.yml`

Crea el fichero `docker-compose.yml` en la raíz del laboratorio.

El compose necesita únicamente **un servicio** para la base de datos. El frontend y el backend seguirán corriendo en local sin Docker.

El servicio de base de datos debe:

- Usar la imagen `mysql:8.0`.
- Configurar las variables de entorno necesarias para establecer la contraseña de root y el nombre de la base de datos.
- Exponer el puerto `3306` al host.
- Usar un bind mount para persistir los datos de MySQL en la carpeta `./mysql-data` del proyecto.
- Usar un bind mount para montar el fichero `./backend/init.sql` en la ruta de inicialización automática de MySQL, de forma que la base de datos se cree sola la primera vez que arranca el contenedor.

---

## Paso 3 — Arranca la base de datos

Levanta el servicio en modo detached y verifica que el contenedor está corriendo. Si hay errores, consulta los logs del servicio.

---

## Paso 4 — Arranca backend y frontend

Con la base de datos corriendo, arranca el backend y el frontend en terminales separadas.

- El backend debe indicar que la conexión a la base de datos se ha establecido correctamente y que el servidor está escuchando en el puerto `3000`.
- El frontend estará disponible en [http://localhost:4321](http://localhost:4321) y mostrará el ranking con las series de ejemplo.

---

## Paso 5 — Añade tus propias series

Añade al menos **3 series** al ranking. Puedes hacerlo desde la interfaz de la aplicación o ejecutando sentencias SQL directamente contra el contenedor de MySQL.

---

## Paso 6 — Verifica la persistencia

Para el contenedor con `docker compose down`, vuelve a levantarlo y comprueba que las series que añadiste siguen estando en la aplicación.

A continuación, para el contenedor, borra manualmente la carpeta `mysql-data/` y vuelve a levantar el servicio. Observa qué ocurre y razona por qué.
