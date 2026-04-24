# 02 Conexión con MongoDB Compass y el problema de la persistencia

En este paso, vamos a conectarnos a nuestro contenedor de MongoDB usando una interfaz gráfica, veremos los datos que hemos insertado y entenderemos el problema de la persistencia de datos en contenedores efímeros.

## 1. Descargar e instalar MongoDB Compass

MongoDB Compass es la interfaz gráfica oficial (GUI) para MongoDB. Nos permite explorar visualmente nuestros datos, ejecutar consultas e interactuar con la base de datos sin usar la línea de comandos.

- Ve a la página oficial de descargas: [Descargar MongoDB Compass](https://www.mongodb.com/products/tools/compass)
- Selecciona tu sistema operativo, descarga el instalador y sigue los pasos típicos de instalación.

## 2. Intentar conectarse al contenedor (y ver el error)

1. Abre **MongoDB Compass**.
2. En la pantalla inicial, verás una barra para introducir tu **URI de conexión** (Connection String).
3. Introduce el URI por defecto:
   ```text
   mongodb://localhost:27017
   ```
4. Haz clic en **Connect** (Conectar).

Verás que la conexión **falla**. Los contenedores son procesos aislados del _host_: tienen su propia red interna y, por defecto, ningún puerto es accesible desde fuera. Como en el ejemplo anterior arrancamos el contenedor sin publicar ningún puerto, MongoDB escucha dentro del contenedor pero nuestra máquina no tiene forma de llegar a él.

## 3. Arrancar el contenedor con mapeo de puertos

Para que Compass pueda llegar a MongoDB, necesitamos exponer el puerto del contenedor en nuestra máquina con el flag `-p`. Primero, eliminamos el contenedor anterior si sigue en pie:

```bash
docker stop mi-servidor-mongo
docker rm mi-servidor-mongo
```

Ahora lo volvemos a arrancar **con el mapeo de puertos**:

```bash
docker run -d --name mi-servidor-mongo -p 27017:27017 mongo:8
```

El flag `-p 27017:27017` indica `<puerto-host>:<puerto-contenedor>`. Así, cualquier conexión al puerto `27017` de tu máquina se redirige al puerto `27017` del contenedor donde escucha MongoDB.

Vuelve a Compass y conecta de nuevo con `mongodb://localhost:27017`. ¡Ahora sí funciona!

> **Nota:** Al haber borrado y recreado el contenedor, hemos perdido los datos que habíamos insertado en el ejemplo anterior (la base de datos `curso_docker` con los alumnos "Daniel" y "Laura"). Si quieres seguir el resto del ejemplo con esos datos, vuelve a insertarlos manualmente. Más adelante veremos cómo evitar esta pérdida de datos de forma definitiva.

## 4. Verificar los datos existentes

Una vez conectado, verás un panel a la izquierda con las bases de datos (como `admin`, `local`, `config`).

- Busca y haz clic en la base de datos que creamos en el paso anterior: `curso_docker`.
- Selecciona la colección `alumnos`.
- Verás en formato de tabla o JSON los documentos que insertamos: "Daniel" y "Laura".

¡La conexión al contenedor desde fuera está funcionando perfectamente!

## 5. El problema de los contenedores efímeros

Los contenedores de Docker, por diseño, son efímeros. Todo el sistema de archivos del contenedor desaparece si el contenedor es eliminado.

Vamos a hacer la prueba:

1. Detenemos y eliminamos el contenedor que teníamos levantado:

```bash
docker stop mi-servidor-mongo
docker rm mi-servidor-mongo
```

2. Volvemos a crear un nuevo contenedor con el mismo comando de antes:

```bash
docker run -d --name mi-servidor-mongo -p 27017:27017 mongo:8
```

3. Vuelve a **MongoDB Compass**, recarga la conexión (botón refrescar arriba a la izquierda).

**¿Qué ha pasado?**
La base de datos `curso_docker` ya no existe. Hemos perdido toda nuestra información.

## 6. Restaurando datos de prueba

Para no perder el tiempo metiendo datos a mano y tener un ejemplo más realista, vamos a restaurar una base de datos más completa en nuestro nuevo contenedor utilizando el backup proporcionado en este directorio.

1. Vamos a utilizar la carpeta `m-flix` que se encuentra dentro de `01-basico/01-mongodb/00-backups/`.

2. Usaremos el comando `docker cp` seguido de `docker exec` combinado con `mongorestore` para volcar directamente la base de datos. Este comando carga los archivos `.bson` dentro de nuestro contenedor y los restaura:

```bash
# Navegamos a la carpeta de los backups donde tenemos 'm-flix'
cd 01-basico/01-mongodb/00-backups

# Copiamos la carpeta al interior del contenedor y lanzamos la restauración:
docker cp m-flix mi-servidor-mongo:/tmp/m-flix
docker exec mi-servidor-mongo mongorestore --db my-movies /tmp/m-flix
```

> **Nota sobre los comandos:**
>
> - `docker cp`: Copia ficheros o directorios entre tu máquina (host) y el contenedor. En este caso, manda nuestra carpeta local `m-flix` a la ruta `/tmp/m-flix` del contenedor.
> - `docker exec ... mongorestore`: Ejecuta el comando nativo `mongorestore` dentro del contenedor en ejecución (`mi-servidor-mongo`), apuntando a la ruta temporal donde acabamos de volcar los datos para restaurarlos en la base de datos. Con el flag `--db my-movies` le indicamos el nombre de la base de datos destino donde debe restaurar los ficheros.
>
> **Importante:** Si falla al restaurar los datos, podemos conectarnos al contenedor con `docker exec -it mi-servidor-mongo sh` y ejecutar ahi el `mongorestore --db my-movies /tmp/m-flix` y debería funcionar.

3. Vuelve a **MongoDB Compass**, recarga la base de datos y verás aparecer una base de datos nueva poblada con varias colecciones llenas de datos (como películas, usuarios, etc.).

### Conclusión

Aunque podemos restaurar datos mediante comandos, tener que hacerlo cada vez que borramos un contenedor (o si el contenedor falla) no es práctico ni seguro para bases de datos reales.

En los próximos ejemplos, veremos la solución real y definitiva de Docker a este problema: **Los Volúmenes de Docker (Docker Volumes)**, que nos permitirán mantener los datos sanos y salvos automáticamente.
