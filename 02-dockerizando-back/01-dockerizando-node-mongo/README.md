# 01 Dockerizando el Backend — Laboratorio

## El escenario

Acabas de incorporarte al equipo de frontend de **Málaga Coffee Dev**, una aplicación para catalogar los cafés típicos de Málaga.

El equipo de backend ya tiene su API lista (Node.js + MongoDB) y te han entregado el código fuente de su servicio. **Tu trabajo es únicamente el frontend.** Sin embargo, para poder desarrollar necesitas que el backend y la base de datos estén corriendo en tu máquina.

El equipo de backend te dice: _"Nosotros ya tenemos nuestro servicio dockerizado. Solo tienes que levantar los contenedores con Docker Compose y conectar todo."_

Tu misión: **crear el fichero `docker-compose.yml` paso a paso** para poder trabajar en local con toda la infraestructura levantada.

## Paso 0 — Arranca el frontend en local (sin Docker)

Antes de nada, comprueba que el frontend funciona por sí solo:

```bash
cd frontend
npm install
npm start
```

Abre `http://localhost:8080`. Verás que la UI carga pero **la sección de cafés guardados falla** al intentar conectar con la API (`/api/coffees`). Normal: no hay backend corriendo todavía.

---

## Paso 1 — Crea el `docker-compose.yml` con la base de datos

Crea el fichero `docker-compose.yml` en la raíz del proyecto con el primer servicio: MongoDB.

```yaml
services:
  coffee-db:
    image: mongo:8
    container_name: coffee-db-container
    ports:
      - "27017:27017"
    volumes:
      - ./coffe-db-data:/data/db
```

Levántalo:

```bash
docker compose up -d
```

Comprueba en **MongoDB Compass** (`mongodb://localhost:27017`) que el servidor está accesible. De momento no hay ninguna base de datos de la aplicación, pero el motor ya está listo.

---

## Paso 2 — Añade el backend

El equipo de backend ya tiene su servicio dockerizado. Para este laboratorio vamos a descargar e instanciar directamente la imagen que compilamos y subimos a Docker Hub en el ejemplo anterior. Al referenciar una imagen ya publicada en un registro, replicamos el flujo de trabajo real de un desarrollador frontend: no necesitas tener el código fuente del backend en tu máquina ni compilarlo, simplemente usas la "caja negra" que te ha proporcionado el equipo de backend.

Añade el servicio `backend` al `docker-compose.yml`:

```diff
services:
  coffee-db:
    image: mongo:8
    container_name: coffee-db-container
    ports:
      - "27017:27017"
    volumes:
      - ./coffe-db-data:/data/db

+ backend:
+   image: <tu-usuario>/coffe-backend:1.0.0
+   ports:
+     - "3000:3000"
+   environment:
+     - MONGODB_URI=mongodb://coffee-db:27017
+     - DB_NAME=malaga-coffee
+     - PORT=3000
+   depends_on:
+     - coffee-db

+networks:
+  default:
+    name: malaga-coffee-network
```

> **Punto clave (Aislamiento y Redes):** Recuerda que los contenedores son, por defecto, procesos totalmente aislados. Si ejecutásemos el backend e intentásemos conectar a la base de datos usando `localhost:27017`, el contenedor del backend buscaría la base de datos dentro de sí mismo (su propio "entorno local"), donde no hay nada instalado y fallaría.
>
> Sin embargo, al crear ambos contenedores dentro de un mismo `docker-compose.yml`, Docker genera una **red privada comun** que los engloba (a la que incluso le podemos dar un nombre personalizado, como aquí debajo con `networks`). Gracias a esta red interna, los contenedores resuelven automáticamente a sus compañeros usando el **nombre del servicio** como si fuera un dominio web. Por eso nuestra `MONGODB_URI` apunta a `mongodb://coffee-db:27017` en vez de usar `localhost` o una IP que la red podría cambiar dinámicamente.
>
> **El rol de `depends_on`:** Fíjate que hemos añadido `depends_on: - coffee-db` al backend. Esto le indica a Docker Compose el orden de arranque: primero debe levantar el contenedor de la base de datos y después el del backend. (Ojo: esto asegura que el contenedor arranque antes, pero no garantiza que la base de datos interna haya terminado su propia carga y esté lista para recibir conexiones. Para algo totalmente infalible usaríamos _healthchecks_).

Reconstruye y levanta:

```bash
docker compose up -d
```

> **Tip de actualización:** Si el equipo de backend sube una nueva versión de su imagen manteniendo el mismo tag (por ejemplo, `1.0.0` o `latest`), Docker no la descargará de nuevo automáticamente si ya existe una copia en tu equipo. Para asegurarte de tener la última versión de todas las imágenes definidas en tu archivo, simplemente ejecuta `docker compose pull` para actualizarlas antes de arrancar el entorno.

---

## Paso 3 — Conecta el frontend al stack

Ahora que el backend está corriendo, el frontend en local puede hablar con él a través del proxy de Vite (configurado en `vite.config.ts` para redirigir `/api` → `http://localhost:3000`).

Vuelve al terminal del frontend y arráncalo:

```bash
cd frontend
npm start
```

Abre `http://localhost:8080`. Ahora sí: el grid de cafés carga datos reales desde MongoDB y el formulario guarda nuevas entradas.

---

## Parar y limpiar

```bash
# Parar los contenedores
docker compose down
```

---

## Resumen de lo aprendido

| Concepto                 | Descripción                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Aislamiento y Redes**  | Los contenedores son entidades aisladas. Compose genera una red privada donde se ven entre ellos.           |
| **Resolución DNS**       | Dentro de Docker, nos comunicamos usando los nombres de los servicios (ej. `coffee-db`), nunca `localhost`. |
| **`depends_on`**         | Asegura el orden de arranque entre servicios (el backend espera a que se inicie la BD).                     |
| **Uso de `image`**       | Nos permite usar proyectos de otros equipos como "cajas negras" pre-compiladas sin tocar su código.         |
| **Actualización**        | Usamos `docker compose pull` para descargar la última versión de las imágenes antes de levantar.            |
| **Variables de entorno** | Sirven para configurar la imagen durante el arranque (p.ej., inyectar credenciales o URLs de conexión).     |
| **Volúmenes**            | Separan y persisten los datos (como MongoDB) para que no se pierdan si se elimina el contenedor.            |

---

## Alternativa: Consumir el Dockerfile en local

Si en lugar de descargar la imagen pre-compilada desde Docker Hub necesitas construirla directamente desde el código fuente y el `Dockerfile` del backend en local, debes usar la instrucción `build` en tu `docker-compose.yml` en lugar de `image`:

```diff
  backend:
-   image: <tu-usuario>/coffe-backend:1.0.0
+   build:
+     context: ../00-conceptos/backend
+     dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

> **Nota**: Asumimos que el backend a compilar se encuentra en `../00-conceptos/backend` o donde tengas alojado su directorio con el Dockerfile. Si tu archivo se llama exactamente `Dockerfile`, bastaría con poner la ruta relativa: `build: ../00-conceptos/backend`.

### Reconstruir la imagen tras una actualización

Cuando usas `build`, Docker compila la imagen la primera vez que levantas el sistema. Si hay cambios o una nueva versión en el código del backend, ejecutar `docker compose up` de nuevo **no recompilará** la imagen por defecto, por lo que no verás los cambios reflejados.

Para forzar la construcción de la imagen y aplicar la nueva versión del código, utiliza el flag `--build`:

```bash
docker compose up -d --build
```

O si solo quieres reconstruir la imagen sin levantar los contenedores en ese momento, puedes usar:

```bash
docker compose build backend
```
