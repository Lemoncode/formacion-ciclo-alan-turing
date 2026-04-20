# 04 Múltiples versiones y Docker Compose

A menudo en el mundo real nos encontramos con sistemas heredados (_legacy_) o trabajando en varios proyectos simultáneamente.

Imagina este escenario: Tienes un proyecto nuevo que requiere la última versión de MongoDB (donde almacenaremos los datos de **m-flix**), pero a la vez, has heredado un proyecto antiguo de alquiler de pisos (**airbnb**) que por dependencias, se rompe si usas una versión superior a **MongoDB 4.4**.

Instalar dos versiones conflictivas de la misma base de datos en tu máquina local puede causar un desastre, conflictos de red, binarios sobreescritos, etc. **Con Docker, esto se soluciona ejecutando un contenedor para cada versión**.

## 1. El problema: Ejecutar la primera aplicación (m-flix) sin base de datos

Para ver el problema en acción, empezarás trabajando con el proyecto moderno (`m-flix`) que tienes en la carpeta `01-inicio`. Consta de una API en Node.js (backend) y un cliente en React (frontend).

### Preparar el entorno de trabajo

Para trabajar de forma limpia, vamos a crear una carpeta nueva y abriremos el editor de código allí. Copia todo el contenido de la carpeta `01-inicio` en la raíz de este nuevo directorio, y las carpetas de `00-backups` dentro de una subcarpeta llamada `backups`:

```bash
# Crea una nueva carpeta y entra en ella
mkdir mi-proyecto-multi
cd mi-proyecto-multi

# Crea la carpeta de backups
mkdir backups

# (Asegúrate de copiar aquí el contenido de 01-inicio y los backups de m-flix y airbnb dentro de la carpeta backups)
```

### Arrancar m-flix e identificar el fallo

Primero, vamos a intentar levantar la aplicación moderna de m-flix.
Entra en la carpeta del backend y crea el archivo `.env` copiando el `.env-example` tal cual está, sin rellenar los datos:

**Backend de m-flix:**

```bash
cp backend-mflix/.env-example backend-mflix/.env
cd backend-mflix
npm install
npm start
# El servidor arrancará pero al no tener los datos de conexión fallará al intentar conectar con la BBDD
```

**Frontend de m-flix (en una nueva terminal):**

```bash
cd frontend-mflix
npm install
npm start
```

Si abres el navegador, verás que el frontend carga pero muestra un error o pide datos infinitamente porque el backend no puede conectarse a la base de datos (¡que no existe aún!). Aquí es donde Docker Compose nos permite levantar la base de datos rápidamente.

## 2. Adiós a los comandos interminables: Docker Compose

Lanzar dos contenedores por separado con sus respectivos volúmenes, puertos y versiones usando el comando `docker run` es tedioso, largo y difícil de recordar y compartir con tu equipo.

Aquí entra **Docker Compose**, una herramienta que nos permite definir de forma declarativa (usando un archivo de texto en formato YAML) cómo queremos que se levante toda nuestra infraestructura de contenedores de golpe.

## 3. Crear nuestro `docker-compose.yml`

Crea un nuevo archivo llamado `docker-compose.yml`. Vamos a "traducir" los comandos de Docker MongoDB que vimos en el otro ejemplo, a esta sintaxis, empezando en un primer paso, **sólo con el proyecto moderno (m-flix)** y usando un volumen local anclado a nuestro directorio de trabajo:

```yaml
services:
  mongo-mflix:
    image: mongo:8
    container_name: mi-servidor-mflix
    ports:
      - "27017:27017"
    volumes:
      - ./mflix-data:/data/db
```

**Desgranando cada sección:**

- **`services`**: Aquí definimos todo lo que queremos levantar en nuestro entorno. Cada sub-elemento se considera un "servicio" independiente. De momento solo tenemos uno: `mongo-mflix`.
- **`image`**: Sustituto natural del comando argumental de `docker run`. Pedimos específicamente la imagen `mongo:8`. **Nota:** Es una buena práctica usar una versión concreta (como `8`) en lugar de `latest`, para evitar que una actualización sorpresiva mañana te rompa la aplicación.
- **`container_name`**: Asigna nuestro nombre personalizado en vez del aleatorio.
- **`ports`**: La equivalencia al flag `-p`. Mapea `"host:contenedor"`.
- **`volumes`**: En lugar de dejar que Docker cree y gestione un volumen oculto, montamos un directorio local de nuestra máquina directamente al contenedor (`./mflix-data`). Con esto, toda la base de datos se guardará físicamente en una carpeta visible llamada `mflix-data` justo al lado de nuestro `docker-compose.yml`.

**Importante:** Si estás trabajando en un repositorio de código (Git), debes añadir siempre estas carpetas (como `mflix-data` o `airbnb-data`) a tu archivo `.gitignore` para evitar subir los pesados binarios de tu base de datos local al repositorio.

## 4. Levantar la base de datos de m-flix

Para crear y arrancar esta infraestructura, ejecuta este comando en tu terminal dentro de la nueva carpeta:

```bash
docker compose up -d
```

> El flag `-d` nos permite arrancar todo en segundo plano (_detached mode_). Podrás notar que se acaba de crear mágicamente la carpeta `./mflix-data` en tu proyecto.

### Configurar conexión

Ahora que la base de datos está corriendo en nuestro puerto `localhost:27017`, podemos ir al archivo `.env` del backend de `m-flix` e introducir sus valores correctos.

Abre `backend-mflix/.env` y edítalo:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=sample_mflix
PORT=3000
```

Inícia otra vez (`npm start`) el servidor backend. Ya deberías ver en la consola que la base de datos se conectó correctamente por primera vez.

### La base de datos vacía y los backups

Si vas ahora al navegador (al frontend m-flix), verás que ¡ya no da un error terrible de conexión!... pero tampoco muestra mucha información. **Tu base de datos está completamente vacía**.

Para cargar los datos con contenido para tus usuarios, debes utilizar los ficheros de backup que copiaste al principio en `backups`:

```bash
# Copiamos la carpeta al contenedor y restauramos
docker cp backups/m-flix mi-servidor-mflix:/tmp/m-flix
docker exec mi-servidor-mflix mongorestore --db sample_mflix /tmp/m-flix
```

Si ahora refrescas el frontend en tu navegador y revisas en **Compass** (`localhost:27017`), ¡toda la información de las películas (`sample_mflix`) de m-flix aparecerá correctamente, todo funcionando y acoplado perfectamente!

## 5. El segundo proyecto: Airbnb (Fallo y reconstrucción)

Con m-flix andando sin problemas, llega un compañero y te pide lanzar el segundo proyecto, la aplicación heredada (legacy) antigua de alquiler de pisos de `airbnb`. Te avisan que **sólo soporta MongoDB 4.4** y no puede arrancar en tu versión actualizada.

Intenta levantarla copiando sus `.env` vacíos igual que la vez anterior para ver el fallo inicial:

**Backend de airbnb (en nueva terminal):**

```bash
cp backend-airbnb/.env-example backend-airbnb/.env
cd backend-airbnb
npm install
npm start
```

**Frontend de airbnb:**

```bash
cd frontend-airbnb
npm install
npm start
```

Si buscas el navegador, este segundo sistema acaba de desplomarse porque ni tan siquiera tiene un puerto para su base de datos.
La solución perfecta usando Docker es añadir el contenedor en otra versión diferente dentro del único e inamovible `docker-compose.yml`.

Con Docker, simplemente abrimos nuestro fichero `docker-compose.yml` e igual que antes creamos un escenario paralelo:

```diff
services:
  ...

+ mongo-airbnb:
+   image: mongo:4.4
+   container_name: mi-servidor-airbnb
+   ports:
+     - "27018:27017" # ¡Cambiamos el puerto host para evitar colisiones!
+   volumes:
+     - ./airbnb-data:/data/db
```

**La clave aquí es:**

1. **`image: mongo:4.4`**: Simplemente hemos puesto esta versión exacta. Docker sacará los binarios empaquetados de esta y la arrancará en cero con total aislamiento de la versión 8 de su "hermano".
2. **`ports: "27018:27017"`**: Puesto que el puerto `27017` de nuestra máquina (host) ya lo estaba usando `mongo-mflix`, no podemos volver a usarlo, daría un error de colisión de "Dirección ya en uso". Al mapearlo hacia el **27018**, nuestra máquina escucha peticiones en ese nuevo puerto y se las manda silenciosamente al `27017` interno de ese segundo contenedor independiente.
3. **`volumes: ./airbnb-data`**: Se creará otra carpeta persistente independiente para estos datos.

Lanza de nuevo el comando:

```bash
docker compose up -d
```

> `docker compose` es inteligente al actualizar. No borrará ni reiniciará tu contenedor de la versión 8 porque no advierte cambios en sus líneas, sólo creará e iniciará la novedad (el de Airbnb).

### Configurar conexión

Ahora que la base de datos antigua tiene puerto propio paralelo (**`localhost:27018`**), podemos ir a su servidor `.env` en `backend-airbnb` y ajustarlo.

Abre `backend-airbnb/.env` y edítalo:

```env
MONGODB_URI=mongodb://localhost:27018
DB_NAME=sample_airbnb
PORT=3001
```

Detén el backend `npm start` y ejecútalo otra vez en su bash. Ahora sí que funciona y tu frontend por el puerto de airbnb cargará. Sin embargo pasa exactamente igual, **¡está vacía de información de pisos de reserva!**

## 6. Carga de datos de Airbnb y comprobación en MongoDB Compass

Igual que en `m-flix`, la última pieza del puzle es inyectar un esquema en la versión `4.4` para cargar la info a Mongo:

```bash
# Hacemos exactamente lo mismo pero atacando al contenedor airbnb
docker cp backups/airbnb mi-servidor-airbnb:/tmp/airbnb
docker exec mi-servidor-airbnb mongorestore --db sample_airbnb /tmp/airbnb
```

¡Milagro de la coexistencia! Ahora tienes dos aplicaciones en vivo y tú no has destruído la infraestructura de local con diferentes versiones de software. Podrás visualizar esto último si vas a tu cliente **MongoDB Compass**:

1. **Servidor M-Flix (Versión 8):** Conéctate a `mongodb://localhost:27017`. Verás la base de datos `sample_mflix` con su información.
2. **Servidor Airbnb (Versión 4.4):** Haz clic en el botón '+' para una nueva conexión e introduce `mongodb://localhost:27018`. Verás que entras a otra instancia completamente separada donde está la base de datos `sample_airbnb`.

## 7. Detener el entorno completo

Otra gran ventaja de Docker Compose es la facilidad para limpiar recursos al finalizar. Para apagar y borrar **ambos contenedores a la vez** manteniendo la persistencia en tus carpetas locales `mflix-data` y `airbnb-data`:

```bash
docker compose down
```

Con un solo comando has detenido y eliminado los dos servidores, ahorrando recursos de tu máquina en segundos de forma limpia.
