# 04 Múltiples versiones y Docker Compose

A menudo en el mundo real nos encontramos con sistemas heredados (_legacy_) o trabajando en varios proyectos simultáneamente.

Imagina este escenario: Tienes un proyecto nuevo que requiere la última versión de MongoDB (donde almacenaremos los datos de **m-flix**), pero a la vez, has heredado un proyecto antiguo de alquiler de pisos (**airbnb**) que por dependencias, se rompe si usas una versión superior a **MongoDB 4.4**.

Instalar dos versiones conflictivas de la misma base de datos en tu máquina local puede causar un desastre, conflictos de red, binarios sobreescritos, etc. **Con Docker, esto se soluciona ejecutando un contenedor para cada versión**.

## 1. Adiós a los comandos interminables: Docker Compose

Lanzar dos contenedores por separado con sus respectivos volúmenes, puertos y versiones usando el comando `docker run` es tedioso, largo y difícil de recordar y compartir con tu equipo.

Aquí entra **Docker Compose**, una herramienta que nos permite definir de forma declarativa (usando un archivo de texto en formato YAML) cómo queremos que se levante toda nuestra infraestructura de contenedores de golpe.

## 2. Preparar el entorno de trabajo y crear nuestro `docker-compose.yml`

Para trabajar de forma limpia, vamos a crear una carpeta nueva exclusiva para este entorno y abriremos el editor de código allí. Copia también la carpeta de backups dentro de este nuevo directorio para tenerlo todo a mano:

```bash
# Crea una nueva carpeta y entra en ella
mkdir mi-servidor-multiple
cd mi-servidor-multiple

# (Asegúrate de copiar aquí la carpeta m-flix y airbnb de los backups)
```

Abre tu editor en esta carpeta y crea un nuevo archivo llamado `docker-compose.yml`. Vamos a "traducir" los comandos de MongoDB que vimos antes a esta sintaxis, empezando en un primer paso, **sólo con el proyecto moderno (m-flix)** y usando un volumen local anclado a nuestro directorio de trabajo:

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

## 3. Levantar y poblar el primer servidor

Para crear y arrancar esta infraestructura, ejecuta este comando en tu terminal dentro de la nueva carpeta:

```bash
docker compose up -d
```

> El flag `-d` nos permite arrancar todo en segundo plano (_detached mode_). Podrás notar que se acaba de crear mágicamente la carpeta `./mflix-data` en tu proyecto.

Una vez listo, vamos a restaurar la base de datos exclusiva del proyecto moderno (`m-flix`) usando la carpeta de backups que copiamos al principio:

```bash
# Copiamos la carpeta al contenedor y restauramos
docker cp m-flix mi-servidor-mflix:/tmp/m-flix
docker exec mi-servidor-mflix mongorestore --db sample_mflix /tmp/m-flix
```

## 4. Evolucionando el entorno: Proyecto heredado (Airbnb)

Ahora viene el escenario crítico. Empiezas a trabajar simultáneamente en el proyecto heredado de reservas de pisos de Airbnb. Te avisan que su software fallará catastróficamente si recibe algo superior a **MongoDB 4.4** debido a ciertas querys de backcompatibilidad.

Con instalaciones de SO tradicional esto sería un quebradero de cabeza; borrar, reinstalar y limpiar variables de entorno (o arriesgarse a solapamientos).

Con Docker, simplemente abrimos nuestro fichero `docker-compose.yml` y definimos un segundo servicio en paralelo junto al otro:

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

## 5. Carga de datos de Airbnb y comprobación en MongoDB Compass

Restaura los datos del segundo proyecto atacando al contenedor viejo con los ficheros del backup local que preparaste:

```bash
# Hacemos exactamente lo mismo pero atacando al contenedor airbnb
docker cp airbnb mi-servidor-airbnb:/tmp/airbnb
docker exec mi-servidor-airbnb mongorestore --db sample_airbnb /tmp/airbnb
```

Abre tu cliente **MongoDB Compass** para ver el milagro de coexistencia:

1. **Servidor M-Flix (Versión 8):** Conéctate a `mongodb://localhost:27017`. Verás la base de datos `sample_mflix` con su información.
2. **Servidor Airbnb (Versión 4.4):** Haz clic en el botón '+' para una nueva conexión e introduce `mongodb://localhost:27018`. Verás que entras a otra instancia completamente separada donde esta la base de datos `sample_airbnb`.

## 6. Detener el entorno completo

Otra gran ventaja de Docker Compose es la facilidad para limpiar recursos al finalizar. Para apagar y borrar **ambos contenedores a la vez** manteniendo la persistencia en tus carpetas locales `mflix-data` y `airbnb-data`:

```bash
docker compose down
```

Con un solo comando has detenido y eliminado los dos servidores, ahorrando recursos de tu máquina en segundos de forma limpia.
