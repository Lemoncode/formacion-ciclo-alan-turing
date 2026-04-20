# 01 Servidor de MongoDB con Docker

En este ejemplo vamos a crear un servidor de MongoDB utilizando contenedores de Docker, conectarnos a él e insertar algunos datos de prueba.

## 1. Buscar la imagen en Docker Hub

Primero, necesitamos la imagen oficial de MongoDB. Todas las imágenes oficiales se encuentran en el registro de [Docker Hub](https://hub.docker.com/). Si buscamos "mongo" allí, encontraremos la [imagen oficial de MongoDB](https://hub.docker.com/_/mongo).

> **Nota:** Si quieres usar una versión específica de MongoDB, puedes especificarla con una etiqueta (`tag`) al final del nombre de la imagen. Por ejemplo, `mongo:5.0` para la versión 5.0. Si no especificas una etiqueta, Docker descargará la última versión disponible (etiqueta `latest`).

## 2. Iniciar el contenedor de MongoDB

Vamos a ejecutar un contenedor en segundo plano (`-d` o `--detach`) para que nuestra terminal no se quede bloqueada, y le asignaremos un nombre (`--name`) para referirnos a él fácilmente. También mapearemos el puerto por defecto de MongoDB (`-p 27017:27017`) a nuestra máquina host:

```bash
docker run -d --name mi-servidor-mongo -p 27017:27017 mongo
```

> [Opciones de Docker run](https://docs.docker.com/engine/reference/commandline/run/)
>
> `-p <puerto_host>:<puerto_contenedor>`: Expone un puerto o un rango de puertos. El puerto de la izquierda corresponde a tu máquina (host) y el de la derecha al puerto dentro del contenedor.
>
> `-d`: Para iniciar un contenedor en segundo plano (detached mode)
>
> **Nota:** Al ejecutar este comando, Docker descargará automáticamente (hará un `pull`) la última versión de la imagen de MongoDB desde Docker Hub si no la tienes en local.

Comprueba que el contenedor está en ejecución:

```bash
docker ps
```

## 3. Conectarse al contenedor e insertar datos

Ahora que tenemos nuestro servidor MongoDB corriendo, vamos a conectarnos a él. Utilizaremos el comando `exec` para abrir una terminal interactiva dentro del contenedor y ejecutar `mongosh` (la Mongo Shell):

```bash
docker exec -it mi-servidor-mongo mongosh
```

Una vez dentro de la consola de MongoDB (`mongosh`), podemos operar como si tuviéramos la base de datos instalada localmente:

1. Cambiar a una nueva base de datos llamada `curso_docker` (se creará automáticamente al insertar datos):

```javascript
use curso_docker
```

2. Insertar un par de documentos simples (en formato JSON) en una colección llamada `alumnos`:

```javascript
db.alumnos.insertOne({ nombre: "Daniel", curso: "Docker" });
db.alumnos.insertOne({ nombre: "Laura", curso: "Kubernetes" });
```

3. Comprobar que los datos se han guardado correctamente consultando la colección:

```javascript
db.alumnos.find();
```

4. Para salir de la consola de MongoDB, simplemente escribe:

```javascript
exit;
```
