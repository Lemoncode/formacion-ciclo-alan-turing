# Laboratorio: MySQL con Docker

## ¿Qué vamos a hacer?

En este laboratorio vamos a:

1. Descargar y arrancar un contenedor de **MySQL** usando Docker
2. Configurar un **volumen** para que los datos persistan aunque paremos el contenedor
3. Cargar la base de datos de ejemplo **Chinook** (una tienda de música ficticia)
4. Ejecutar consultas SQL para explorar los datos

Al terminar tendrás un MySQL completamente funcional corriendo en tu máquina, sin haberlo instalado de forma tradicional.

```
┌─────────────────────────────────────────┐
│           Tu ordenador                  │
│                                         │
│  ┌──────────────────────────┐           │
│  │  Contenedor mysql-chinook│           │
│  │  ┌────────────────────┐  │           │
│  │  │   MySQL 8.0        │  │  :3306    │◄── tú te conectas aquí
│  │  └────────────────────┘  │           │
│  └──────────┬───────────────┘           │
│             │ monta                     │
│  ┌──────────▼───────────────┐           │
│  │  Volumen: mysql-chinook-data│        │
│  │  (datos persistentes)    │           │
│  └──────────────────────────┘           │
└─────────────────────────────────────────┘
```

---

## Prerequisitos

- Docker Desktop instalado y en ejecución (icono verde en la barra de tareas / barra de menús)
- Si aún no lo tienes instalado, consulta la [guía de instalación de Docker Desktop](../../00-guia/01-instalacion-docker-desktop.md)

---

## Paso 1: La imagen de MySQL

Antes de crear nada, necesitamos entender qué es una **imagen** en Docker.

> 💡 **Analogía:** Piensa en una imagen como una **receta de cocina**. La receta describe exactamente cómo preparar un plato, con todos los ingredientes y pasos. El contenedor es el plato ya cocinado siguiendo esa receta. Puedes cocinar el mismo plato (crear múltiples contenedores) a partir de la misma receta (imagen).

La imagen oficial de MySQL está publicada en **Docker Hub**, el repositorio público de imágenes de Docker.

**Referencia oficial:** [Imagen oficial de MySQL en Docker Hub](https://hub.docker.com/_/mysql)

Vamos a usar la versión `mysql:8.0`, que es la versión estable más usada actualmente.

> 💡 **Buena noticia para usuarios de Mac con Apple Silicon (M1/M2/M3/M4):** A diferencia de otras bases de datos, la imagen oficial de MySQL tiene soporte nativo para procesadores ARM. No necesitas ninguna configuración adicional — el mismo comando funciona igual en Mac Intel, Mac Apple Silicon y Windows.

---

## Paso 2: Crear el contenedor con volumen

### ¿Qué es un volumen?

Por defecto, cuando paras o eliminas un contenedor Docker, **todos los datos que había dentro desaparecen**. Para una base de datos esto sería un desastre.

Los **volúmenes** son la solución: son carpetas especiales gestionadas por Docker que viven **fuera** del contenedor. Aunque borres el contenedor, el volumen (y todos los datos) siguen ahí.

> 💡 **Analogía:** El contenedor es el frigorífico. Los datos son la comida. Si tiras el frigorífico (borras el contenedor), sin volumen pierdes la comida. Con un volumen, es como tener la comida en una nevera portátil separada: puedes cambiar el frigorífico sin perder nada.

### Crear el contenedor

Ejecuta el siguiente comando en tu terminal:

**Mac / Linux (Terminal):**

```bash
docker run \
  --name mysql-chinook \
  -e MYSQL_ROOT_PASSWORD=LemonCode1234 \
  -p 3306:3306 \
  -v mysql-chinook-data:/var/lib/mysql \
  -d \
  mysql:8.0
```

**Windows (PowerShell):**

```powershell
docker run `
  --name mysql-chinook `
  -e MYSQL_ROOT_PASSWORD=LemonCode1234 `
  -p 3306:3306 `
  -v mysql-chinook-data:/var/lib/mysql `
  -d `
  mysql:8.0
```

> 💡 **NOTA:** En Mac/Linux el carácter `\` permite dividir un comando largo en varias líneas. En Windows PowerShell se usa `` ` `` (acento grave). Si prefieres, puedes escribirlo todo en una sola línea sin esos caracteres.

### ¿Qué significa cada parámetro?

| Parámetro                              | Qué hace                                                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--name mysql-chinook`                 | Le da un nombre al contenedor para poder referenciarlo fácilmente en otros comandos                                                     |
| `-e MYSQL_ROOT_PASSWORD=LemonCode1234` | Establece la contraseña del usuario `root` de MySQL. La `-e` significa "variable de entorno" (_environment_)                            |
| `-p 3306:3306`                         | Conecta el puerto 3306 de tu ordenador con el puerto 3306 del contenedor. Formato: `puerto_tu_ordenador:puerto_contenedor`              |
| `-v mysql-chinook-data:/var/lib/mysql` | Crea un volumen llamado `mysql-chinook-data` y lo conecta a `/var/lib/mysql`, que es donde MySQL guarda sus datos dentro del contenedor |
| `-d`                                   | Ejecuta el contenedor en segundo plano (_detached_), sin bloquear la terminal                                                           |
| `mysql:8.0`                            | La imagen que se usa para crear el contenedor: MySQL versión 8.0                                                                        |

**Documentación oficial de los parámetros de `docker run`:** [Docker run reference](https://docs.docker.com/reference/cli/docker/container/run/)

### Verificar que el contenedor está en marcha

```bash
docker ps
```

Deberías ver algo similar a:

```
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                               NAMES
a3f1b2c4d5e6   mysql:8.0   "docker-entrypoint.s…"   10 seconds ago  Up 9 seconds   0.0.0.0:3306->3306/tcp              mysql-chinook
```

Lo importante es que en la columna **STATUS** aparezca `Up`.

> 📸 **CAPTURA:** Terminal mostrando la salida de `docker ps` con el contenedor `mysql-chinook` en estado "Up".

Si el contenedor no aparece o aparece en estado `Exited`, revisa los logs para ver qué ha pasado:

```bash
docker logs mysql-chinook
```

> 📸 **CAPTURA:** Docker Desktop con el contenedor `mysql-chinook` visible en la sección Containers con el indicador verde de "Running".

---

## Paso 3: Descargar la base de datos Chinook

**Chinook** es una base de datos de ejemplo que simula una tienda de música digital. Contiene artistas, álbumes, pistas, clientes y facturas. Es ampliamente usada para aprender SQL.

**Repositorio oficial:** [lerocha/chinook-database en GitHub](https://github.com/lerocha/chinook-database)

Necesitas descargar el archivo SQL para MySQL. Elige la opción que prefieras:

### Opción A: Desde el navegador

Haz clic en el siguiente enlace para descargar el archivo directamente:

**[Descargar Chinook_MySql.sql](https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_MySql.sql)**

El archivo se llamará `Chinook_MySql.sql`. Toma nota de la carpeta donde lo has guardado — la necesitarás en el paso siguiente.

> 💡 **NOTA:** Al abrir el enlace, es posible que el navegador muestre el contenido en lugar de descargarlo. En ese caso, usa la opción "Guardar como..." del menú de tu navegador (Ctrl+S en Windows, Cmd+S en Mac).

### Opción B: Desde la terminal

**Mac / Linux:**

```bash
curl -O https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_MySql.sql
```

**Windows (PowerShell):**

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/lerocha/chinook-database/master/ChinookDatabase/DataSources/Chinook_MySql.sql" -OutFile "Chinook_MySql.sql"
```

---

## Paso 4: Cargar la base de datos en el contenedor

Ahora vamos a inyectar el archivo SQL dentro del contenedor MySQL para crear la base de datos y cargar todos los datos.

Usaremos `docker exec`, un comando que permite ejecutar instrucciones dentro de un contenedor que ya está en marcha.

> ⚠️ **IMPORTANTE:** Espera al menos **15-20 segundos** después de haber creado el contenedor antes de ejecutar este paso. MySQL necesita unos segundos para inicializarse por primera vez. Si ves un error de conexión, espera un poco más y vuelve a intentarlo.

Abre la terminal y **navega hasta la carpeta donde descargaste `Chinook_MySql.sql`**:

```bash
# Ejemplo si lo descargaste en la carpeta Descargas:
cd ~/Downloads      # Mac/Linux
cd ~\Downloads      # Windows PowerShell
```

Ahora ejecuta el comando según tu sistema:

**Mac / Linux:**

```bash
docker exec -i mysql-chinook mysql -u root -pLemonCode1234 < Chinook_MySql.sql
```

**Windows (PowerShell):**

```powershell
Get-Content Chinook_MySql.sql | docker exec -i mysql-chinook mysql -u root -pLemonCode1234
```

> 💡 **¿Qué hace este comando?**
>
> - `docker exec -i mysql-chinook` — ejecuta un comando dentro del contenedor llamado `mysql-chinook`. El flag `-i` mantiene abierta la entrada estándar para poder enviarle datos.
> - `mysql -u root -pLemonCode1234` — abre el cliente MySQL con el usuario `root` y la contraseña indicada.
> - `< Chinook_MySql.sql` — redirige el contenido del archivo SQL como entrada al cliente MySQL, que lo ejecuta línea a línea.

El comando no muestra ninguna salida si todo va bien. Si tarda unos segundos, es normal — está insertando miles de filas.

> ⚠️ **IMPORTANTE:** Si ves el mensaje `mysql: [Warning] Using a password on the command line interface can be insecure.` es solo un aviso informativo, no un error. La base de datos se habrá cargado correctamente.

---

## Paso 5: Verificar que la base de datos se cargó correctamente

Vamos a entrar dentro del contenedor y comprobar que todo está en su sitio.

### Conectar al cliente MySQL

```bash
docker exec -it mysql-chinook mysql -u root -pLemonCode1234
```

Si la conexión es exitosa, verás el prompt de MySQL:

```
mysql>
```

> 📸 **CAPTURA:** Terminal mostrando el prompt `mysql>` después de conectar al contenedor.

### Comprobar las bases de datos

```sql
SHOW DATABASES;
```

Deberías ver `Chinook` en la lista:

```
+--------------------+
| Database           |
+--------------------+
| Chinook            |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

### Seleccionar la base de datos y ver las tablas

```sql
USE Chinook;
SHOW TABLES;
```

```
+-------------------+
| Tables_in_Chinook |
+-------------------+
| Album             |
| Artist            |
| Customer          |
| Employee          |
| Genre             |
| Invoice           |
| InvoiceLine       |
| MediaType         |
| Playlist          |
| PlaylistTrack     |
| Track             |
+-------------------+
```

### Verificar el número de pistas

```sql
SELECT COUNT(*) FROM Track;
```

```
+----------+
| COUNT(*) |
+----------+
|     3503 |
+----------+
```

Si ves **3503 pistas**, la carga fue perfecta.

> 📸 **CAPTURA:** Terminal MySQL mostrando el resultado de `SELECT COUNT(*) FROM Track` con el valor 3503.

Para salir del cliente MySQL:

```sql
EXIT;
```

---

## Parte obligatoria: Consultas

Antes de empezar, conéctate al contenedor:

```bash
docker exec -it mysql-chinook mysql -u root -pLemonCode1234
```

Y selecciona la base de datos:

```sql
USE Chinook;
```

---

### Consulta 1: Listar las pistas con precio mayor o igual a 1 €

En la tabla `Track`, la columna `UnitPrice` almacena el precio de cada pista. En la base de datos Chinook los precios son **0.99** (pistas de audio estándar) y **1.99** (pistas de vídeo). Esta consulta devuelve las pistas más caras.

La cláusula `WHERE` filtra las filas según una condición. Solo se devuelven las filas donde la condición es verdadera.

```sql
SELECT TrackId, Name, Composer, UnitPrice
FROM Track
WHERE UnitPrice >= 1;
```

**Resultado esperado:** 215 pistas con precio 1.99.

---

### Consulta 2: Listar las pistas de más de 4 minutos de duración

La columna `Milliseconds` almacena la duración de cada pista en milisegundos (no en minutos ni segundos). Para filtrar por duración necesitamos convertir los minutos a milisegundos:

```
4 minutos × 60 segundos × 1.000 milisegundos = 240.000 ms
```

```sql
SELECT TrackId, Name, Composer, Milliseconds
FROM Track
WHERE Milliseconds > 240000;
```

**Resultado esperado:** más de 1.500 pistas.

> 💡 **NOTA:** ¿Quieres ver la duración en un formato más legible? Puedes usar expresiones en el SELECT:
>
> ```sql
> SELECT Name, ROUND(Milliseconds / 60000, 2) AS Minutos
> FROM Track
> WHERE Milliseconds > 240000;
> ```

---

### Consulta 3: Listar las pistas con duración entre 2 y 3 minutos

Para buscar valores dentro de un rango usamos `BETWEEN`. Es equivalente a escribir `>= valor_minimo AND <= valor_maximo`, pero más legible.

Conversiones:

```
2 minutos = 120.000 ms
3 minutos = 180.000 ms
```

> 💡 **NOTA:** `BETWEEN` es **inclusivo** en ambos extremos: incluye exactamente los valores 120.000 y 180.000.

```sql
SELECT TrackId, Name, Composer, Milliseconds
FROM Track
WHERE Milliseconds BETWEEN 120000 AND 180000;
```

**Resultado esperado:** alrededor de 1.000 pistas.

---

### Consulta 4: Listar las pistas cuyo compositor incluya "Mercury"

La columna `Composer` contiene el nombre del compositor de la pista. Para buscar un texto que **contiene** una cadena (no que sea exactamente igual) usamos el operador `LIKE` junto con el comodín `%`.

- `%` representa **cualquier secuencia de caracteres** (incluyendo ninguno)
- `'%Mercury%'` significa: "cualquier texto que contenga Mercury en cualquier posición"

```sql
SELECT TrackId, Name, Composer
FROM Track
WHERE Composer LIKE '%Mercury%';
```

**Resultado esperado:** pistas de Queen compuestas por Freddie Mercury.

> 💡 **¿En qué se diferencia `LIKE` de `=`?**
>
> - `WHERE Composer = 'Mercury'` solo devolvería pistas donde el compositor es **exactamente** la palabra "Mercury"
> - `WHERE Composer LIKE '%Mercury%'` devuelve pistas donde el compositor **contiene** "Mercury" en cualquier parte del texto (por ejemplo: "Freddie Mercury", "Mercury/May/Taylor/Deacon", etc.)

---

## Parte opcional: Para seguir practicando

Los siguientes ejercicios no incluyen la solución. El objetivo es que los resuelvas por tu cuenta usando lo que has aprendido y explorando las tablas de Chinook.

> 💡 **Consejo:** Antes de escribir una consulta, explora la estructura de la tabla con `DESCRIBE nombre_tabla;`. Por ejemplo: `DESCRIBE Track;`

---

### Ejercicio 1: Pistas sin compositor registrado

Algunas pistas no tienen compositor registrado — el valor de la columna `Composer` es `NULL` (ausencia de valor).

**Enunciado:** Lista el nombre de todas las pistas que no tienen compositor registrado.

**Tabla:** `Track`  
**Columnas relevantes:** `Name`, `Composer`  
**Pista:** Para comprobar si un valor es nulo no se usa `= NULL` sino la cláusula `IS NULL`

---

### Ejercicio 2: Las 10 pistas más largas

**Enunciado:** Lista las 10 pistas con mayor duración, mostrando el nombre y la duración en milisegundos. Ordénalas de mayor a menor duración.

**Tabla:** `Track`  
**Columnas relevantes:** `Name`, `Milliseconds`  
**Pista:** Necesitarás `ORDER BY` para ordenar y `LIMIT` para limitar el número de resultados

---

### Ejercicio 3: Pistas de un género concreto

La tabla `Track` no almacena el nombre del género directamente — solo almacena un `GenreId` (un número). El nombre del género está en la tabla `Genre`.

**Enunciado:** Lista el nombre de todas las pistas que pertenecen al género "Jazz".

**Tablas:** `Track`, `Genre`  
**Columnas relevantes:** `Track.Name`, `Track.GenreId`, `Genre.GenreId`, `Genre.Name`  
**Pista:** Necesitarás un `JOIN` para combinar la información de las dos tablas. Investiga `INNER JOIN ... ON`

---

### Ejercicio 4: Cuántas pistas hay por género

**Enunciado:** Muestra cuántas pistas tiene cada género, ordenadas de mayor a menor cantidad.

**Tablas:** `Track`, `Genre`  
**Columnas relevantes:** `Genre.Name`, `COUNT(*)`  
**Pistas:**

- Necesitarás un `JOIN` entre `Track` y `Genre`
- Usa `GROUP BY` para agrupar los resultados por género
- Usa `COUNT(*)` para contar las pistas de cada grupo
- Usa `ORDER BY` con `DESC` para ordenar de mayor a menor

---

### Ejercicio 5: Pistas de un artista concreto

Este ejercicio requiere unir tres tablas. La relación es:

```
Track → Album → Artist
```

**Enunciado:** Lista el nombre de todas las pistas del artista "AC/DC".

**Tablas:** `Track`, `Album`, `Artist`  
**Columnas relevantes:** `Track.Name`, `Track.AlbumId`, `Album.AlbumId`, `Album.ArtistId`, `Artist.ArtistId`, `Artist.Name`  
**Pista:** Necesitarás dos `JOIN` encadenados para llegar desde `Track` hasta `Artist`

---

## Comandos útiles de Docker para este laboratorio

```bash
# Ver el estado del contenedor
docker ps

# Ver los logs del contenedor (útil si algo falla)
docker logs mysql-chinook

# Parar el contenedor (los datos se conservan en el volumen)
docker stop mysql-chinook

# Volver a arrancar el contenedor
docker start mysql-chinook

# Conectar al cliente MySQL dentro del contenedor
docker exec -it mysql-chinook mysql -u root -pLemonCode1234

# Ver los volúmenes creados
docker volume ls

# Ver información detallada del volumen
docker volume inspect mysql-chinook-data
```

> 💡 **¿Qué pasa con mis datos si paro el contenedor?** Nada. Los datos están en el volumen `mysql-chinook-data`, que es independiente del contenedor. Puedes parar y arrancar el contenedor tantas veces como quieras — los datos siempre estarán ahí.

---

## Referencias

- [Imagen oficial de MySQL en Docker Hub](https://hub.docker.com/_/mysql)
- [Repositorio Chinook Database](https://github.com/lerocha/chinook-database)
- [Documentación de volúmenes en Docker](https://docs.docker.com/engine/storage/volumes/)
- [Referencia del comando docker run](https://docs.docker.com/reference/cli/docker/container/run/)
- [Referencia del comando docker exec](https://docs.docker.com/reference/cli/docker/container/exec/)
- [MySQL 8.0 — Referencia SQL](https://dev.mysql.com/doc/refman/8.0/en/)
- [MySQL LIKE operator — documentación oficial](https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like)
- [MySQL BETWEEN operator — documentación oficial](https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_between)
