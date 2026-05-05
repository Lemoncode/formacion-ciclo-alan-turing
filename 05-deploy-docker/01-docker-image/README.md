# 01 Docker Image

En este ejemplo vamos a crear y ejecutar imágenes personalizadas de Docker para paquetizar y aislar nuestra aplicación.

Partiremos del código resultante en el ejemplo `03-deploy-manual/02-azure-ftp` (puesto que contiene la aplicación frontend compilable más un pequeño servidor web Hono configurado).

> **Nota importante:** A diferencia de los ejemplos anteriores, aquí **no necesitas ejecutar `npm install` en tu máquina local**. El objetivo de Dockerizar la aplicación es que todo el proceso de instalación de dependencias, compilación y ejecución ocurra única y exclusivamente dentro del contenedor asilado, preparando la aplicación para publicarla en cualquier sistema.

## Paso 1 — Escribiendo nuestro primer Dockerfile

Vamos a crear nuestra propia imagen paso a paso. Para ello, necesitamos crear un fichero sin ninguna extensión llamado `Dockerfile`. Basaremos nuestra imagen en Node.js, usando la variante `alpine` que es una versión de Linux hiper-reducida ideal para contenedores ligeros:

_./Dockerfile_

```Dockerfile
FROM node:24-alpine
```

> **Consejo:** Para tener autocompletado y un correcto resaltado de sintaxis, es muy recomendable instalar la [extensión oficial de Docker para VSCode](https://code.visualstudio.com/docs/containers/overview).

Vamos a indicarle a Docker en qué directorio interno de esa máquina virtual ficticia interactuaremos:

_./Dockerfile_

```diff
FROM node:24-alpine
+ RUN mkdir -p /usr/app
+ WORKDIR /usr/app

```

> - `RUN`: Ejecuta un comando bash durante el "momento de construcción" de la imagen.
> - `WORKDIR`: Define el directorio de trabajo. Todas las directivas posteriores referenciarán rutas relativas a esta carpeta, y cuando nos metamos al contenedor empezaremos en esa carpeta.

Ahora toca copiar el código desde tu máquina al contenedor. Pero antes, para evitar copiar archivos innecesarios (como los `node_modules` de tu entorno local que podrían interferir con una arquitectura distinta en Linux), crearemos un archivo oculto similar a `.gitignore`:

_./.dockerignore_

```
.github
node_modules
dist
.gitignore
.prettierrc
.env.development
```

Optimizando la caché de Docker copiando primero los archivos de dependencias. Docker construye las imágenes en capas; si copiamos primero el `package.json` y el `package-lock.json`, e instalamos las dependencias, Docker guardará esa capa en caché. Así, si después solo cambias el código de la app, el tardío paso de instalación de dependencias no tendrá que volverse a ejecutar repetidamente en cada construcción.

_./Dockerfile_

```diff
FROM node:24-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

+ COPY package*.json ./
+ RUN npm ci
```

Copiamos todo el resto del código (aprovechando que `.dockerignore` filtra los módulos locales) y compilamos nuestra aplicación frontend:

_./Dockerfile_

```diff
FROM node:24-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

+ COPY ./ ./
+ RUN npm run build

```

## Paso 2 — Construyendo e interaccionando con la imagen

Para que este plano se convierta en una "imagen" interactiva, necesitamos construirla (_build_):

```bash
docker build -t my-app:1 .
```

> `-t`: Equivale a _tag_. Nos permite asignarle un nombre a nuestra imagen, habitualmente usando el patrón `nombre:etiqueta`.

De momento esta imagen sólo construye cosas pero no levanta un servidor por sí misma. Vamos a ejecutar un contenedor a partir de esta imagen pero conectándonos directamente por terminal interactiva (`sh`) para cotillear qué hay dentro de la carpeta:

```bash
docker images

docker run --name my-app-container -it my-app:1 sh
```

En la consola del contenedor:

```bash
> ls
> ls dist
> exit
```

Vemos que el _build_ existe de verdad dentro de `/usr/app/dist`. Como nuestro contenedor de prueba ha terminado, vamos a borrarlo:

```bash
docker rm my-app-container
```

## Paso 3 — Inyectando e iniciando el Servidor Web

Queremos que este contenedor, al ejecutarse, mantenga nuestra página viva para siempre de forma autónoma. Vamos a actualizar nuestro `Dockerfile` para que prepare también la carpeta estática que necesita nuestro miniserver de `Hono` (exactamente igual que hicimos de forma manual con Azure) y configuraremos el punto de entrada de la aplicación:

_./Dockerfile_

```diff
FROM node:24-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

+ RUN cp -r ./dist ./server/public
+ RUN cd server && npm ci

+ WORKDIR /usr/app/server
+ CMD ["node", "index.js"]

```

> **¿Por qué cambiamos el WORKDIR al final?**
> Al hacer `WORKDIR /usr/app/server`, nos aseguramos de que el proceso de Node considere esa carpeta como su directorio actual de ejecución (`cwd`). Así, cuando Hono intente servir la web desde la ruta relativa `./public`, buscará dentro de `server/public` (donde los acabamos de copiar) y no en la raíz. Evitando así errores de rutas no encontradas.

> **Diferencias técnicas:**
>
> - `RUN` ejecuta un comando mientras construyes la imagen al hacer _build_.
> - `CMD` es la orden predeterminada que arranca cuando utilizas _run_ para levantar el contenedor. Puede sobreescribirse fácilmente si pasas tu propio comando al final de `docker run`.
> - `ENTRYPOINT` (no usado en este ejemplo) fija un ejecutable de forma más estricta. Si se configura, lo que definas en `CMD` (o en el CLI) pasará a considerarse como los parámetros o argumentos de ese Entrypoint.
>
> 📚 [Lectura extra sobre Docker RUN vs CMD vs ENTRYPOINT](https://codewithyury.com/docker-run-vs-cmd-vs-entrypoint/)

Reconstruimos y probamos este comportamiento:

```bash
docker build -t my-app:1 .
docker run --name my-app-container my-app:1

# En otra pestaña de la misma consola puedes indagar su sistema de archivos en vivo
docker exec -it my-app-container sh
> ls
> ls server
> exit
```

Trata de acceder en tu navegador a `http://localhost:8081`.

¿Por qué **no carga nada** si Hono dijo en sus logs internos que la url era `http://localhost:8081`? ¡Porque el contenedor es un proceso totalmente aislado con su propia red! La máquina de Docker tiene abierto 8081, pero no tu propio ordenador (tu Mac/Windows/Linux anfitrión). Tenemos que mapear un puerto interno con uno expuesto en tu ordenador.

Eliminamos el contenedor:

```bash
# ctrl + c / O desde nueva shell:
docker stop my-app-container
docker rm my-app-container
```

Vamos a definir una variable de entorno (`ENV`) dentro del Dockerfile para demostrar cómo el puerto interno de la aplicación Hono puede ser sobrescrito y modificado fácilmente a nuestra voluntad:

_./Dockerfile_

```diff
...

+ ENV PORT=8083
WORKDIR /usr/app/server
CMD ["node", "index.js"]

```

Construimos y ahora al arrancar exponemos ese puerto (`-p puerto_tu_ordenador:puerto_contenedor`):

```bash
docker build -t my-app:1 .

docker run --name my-app-container --rm -d -p 8080:8083 my-app:1
```

> **Opciones útiles de `run`:**
>
> - `-p`: Mapea los puertos con el formato `local:contenedor`. En este caso le decimos "coge mi puerto local 8080 (el de fuera) y conéctalo al puerto 8083 del contenedor anidado".
> - `--rm`: Borra el contenedor automáticamente de la lista `docker ps -a` cuando se detenga (`stop`). Esto es súper higiénico en desarrollo para no ensuciar.
> - `-d`: (Detached) Ejecuta la terminal en "segundo plano" (sin bloquearte la pestaña actual de la terminal).

Ahora **SÍ** lograrás ver la web en local desde tu ordenador abriendo: `http://localhost:8080`.

## Paso 4 — Optimización extrema: Multi-stage Builds

Estando todo listo, detén el contenedor (`docker stop my-app-container`).

Frente a la consola te propongo este comando que lista todas las imágenes generadas y cuánto pesa la nuestra:

```bash
docker images
```

Verás que `my-app:1` pesa **entre 500 y 600 MB**. ¿Demasiado para servir una aplicación tan simple, verdad? Pesa muchísimo porque tiene el código fuente, carpeta `node_modules` del frontend, la imagen node completa, herramientas de compilador, caché npm... ¡Archivos inútiles para correr un servidor web ya compilado!

Docker ofrece [**Multi-stage builds** (Construcciones por etapas)](https://docs.docker.com/build/building/multi-stage/) para solucionar esto. Solo copiaremos en la imagen final los mínimos bytes imprescindibles.

El objetivo es transformar el sistema de archivos del contenedor, pasando de esta estructura pesada inicial (llena de herramientas y archivos residuales de desarrollo):

```text
|-- /usr/app
|------ server/
|----------- node_modules/
|----------- public/
|----------- index.js
|----------- package.json
|----------- package-lock.json
|------ src/
|------ (etc...)

```

a esto (ultra limpio):

```text
|-- /usr/app
|------ public/
|------ index.js
|------ package.json
|------ package-lock.json
```

Vamos a refactorizar el Dockerfile en **etapas** separadas por la palabra clave `FROM`. Los archivos valiosos generados en las primeras etapas (como los _dist_ compilados) podemos copiarlos selectivamente a nuestra capa de lanzamiento, abandonando de forma eficiente todas aquellas librerías y cachés temporales de desarrollo para que no arrastren peso en el contenedor final.

_./Dockerfile_

```diff
- FROM node:24-alpine
+ FROM node:24-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

+ # Compilamos frontend
+ FROM base AS build-front
COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

- RUN cp -r ./dist ./server/public
- RUN cd server && npm ci
+ # Release final (lo que realmente necesitamos subir)
+ FROM base AS release
+ COPY --from=build-front /usr/app/dist ./public
+ COPY ./server/package*.json ./
+ COPY ./server/index.js ./
+ RUN npm ci

ENV PORT=8083
- WORKDIR /usr/app/server
CMD ["node", "index.js"]

```

Construyamos la nueva etiqueta limpia (`my-app:2`):

```bash
docker build -t my-app:2 .
docker images
```

Aquí notarás la barbaridad de mejora brutal de tamaño de `my-app:2` frente a la vieja versión. Solo te pesan los `node_modules` de Hono, la base Alpine y tus `dist` finales.

Pruébalo para validar que no hemos roto nada tras la optimización:

```bash
docker run --name my-app-container --rm -d -p 8080:8083 my-app:2
docker exec -it my-app-container sh
> ls
> exit
```

> **¡Fíjate bien!** Si haces `ls` dentro de este contenedor optimizado, verás que los archivos resultantes son **exactamente los mismos** (el `index.js`, dependencias y la carpeta `/public` con el dist) que los que tuvimos que arrastrar a mano usando FileZilla en el ejemplo manual de **Azure FTP**. ¡Ese es el poder del multi-stage build: separar automáticamente el grano (lo listo para producción) de la paja (todo el ruido de desarrollo)!

## Paso 5 — Ajustes en runtime (Variables de entorno)

Es buena práctica no inyectar "hardcodeada" dentro de las aplicaciones las rutas a datos u otros detalles fijos si pueden variar, para no estar rehaciendo imagenes completas todo el tiempo.

Vamos a permitir inyectar variables de entorno (`process.env`) en nuestra mini aplicación Hono y usarlas desde los Dockerfiles correspondientemente.

_./server/index.js_

```diff
...
const app = new Hono();

- const STATIC_FILES_PATH = "./public";
+ const STATIC_FILES_PATH = process.env.STATIC_FILES_PATH;

...
```

Adaptamos nuestro paso de empaquetado multi-stage inyectando la nueva ENV, que se quedará incrustada junto con la imagen:

_./Dockerfile_

```diff
...
# Release
FROM base AS release
+ ENV STATIC_FILES_PATH=./public
- COPY --from=build-front /usr/app/dist ./public
+ COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY ./server/package*.json ./
...

```

Aplica el último build y levántalo una última vez:

```bash
docker build -t my-app:2 .
docker stop my-app-container

docker run --name my-app-container --rm -d -p 8080:8083 my-app:2
```

Update Dockerfile:

_./Dockerfile_

```diff
...
# Release
FROM base AS release
+ ENV STATIC_FILES_PATH=./public
- COPY --from=build-front /usr/app/dist ./public
+ COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY ./server/package*.json ./
...

```

Run again

```bash
docker build -t my-app:2 .
docker images

docker stop my-app-container
docker run --name my-app-container --rm -d -p 8080:8083 my-app:2
docker exec -it my-app-container sh
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
