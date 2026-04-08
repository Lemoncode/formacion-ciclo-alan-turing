# 01 Comandos básicos de Docker

En este ejemplo vamos a aprender y ejecutar comandos de Docker.

Primero, comprobaremos las imágenes construidas (`built images`) disponibles en local:

```bash
docker images
```

¿Cómo descargar una nueva? Podemos usar `docker pull` para descargar imágenes externas preconstruidas. Si no usamos ninguna etiqueta (`tag`), descargará la etiqueta `latest` por defecto:

```bash
docker pull hello-world
```

> `hello-world` es una imagen existente.
>
> Por defecto, descarga todas las imágenes del registro de [Docker hub](https://hub.docker.com/).
>
> [Descargar desde un registro diferente](https://docs.docker.com/engine/reference/commandline/pull/#pull-from-a-different-registry): docker pull myregistry.local:5000/testing/test-image

Comprueba ahora las imágenes disponibles:

```bash
docker images
```

Para ejecutar una imagen necesitamos un contenedor (`container`) de Docker, para crear un nuevo contenedor basado en una imagen, debemos usar el comando `docker run`. Antes de eso, podemos listar cuántos contenedores tenemos:

```bash
docker ps
docker ps --all
docker ps -a
```

> ps: Process Status (Estado del Proceso)
>
> `docker ps`: Lista los contenedores activos actuales
>
> `docker ps -a / --all`: Lista todos los contenedores (activos e inactivos)

Vamos a ejecutar la imagen:

```bash
docker run hello-world
```

Esta imagen se ejecutó en un contenedor y este se detuvo tras la ejecución. Podemos comprobarlo con:

```bash
docker ps -a
```

Para ejecutar un contenedor detenido tenemos que usar `docker start` y no `run` porque `docker run` crearía un nuevo contenedor a partir de la imagen:

```bash
docker start <Container ID> -i
```

> -i / --interactive: Adjunta la entrada estándar (STDIN) del contenedor
>
> Podemos usar los primeros 4 dígitos del ID del contenedor (`Container ID`).

Creando un nuevo contenedor con la misma imagen:

```bash
docker run hello-world
docker ps -a
```

> NOTA: Podemos darle un nombre a un contenedor así: `docker run --name my-container hello-world`

Vamos a eliminar todos los contenedores detenidos:

```bash
docker container rm <CONTAINER ID>
docker rm <CONTAINER ID>
docker container prune
```

> `prune`: Elimina todos los contenedores detenidos

`docker run` descarga (`pull`) las imágenes automáticamente si no las tiene localmente. Vamos a eliminar una imagen existente:

```bash
docker image rm <IMAGE NAME>:<TAG>
docker rmi <IMAGE NAME>:<TAG>
```

Finalmente, podemos ejecutar un contenedor en modo interactivo:

```bash
docker run ubuntu // se detiene automáticamente
docker run -it ubuntu sh
```

> Descarga la imagen `ubuntu` sin usar el comando `pull`.
>
> NOTA: Abre un nuevo terminal y escribe `docker ps -a`.
>
> sh: similar a una terminal bash
>
> Veremos en próximos ejemplos cómo conectarnos en modo interactivo a un contenedor en ejecución usando `docker exec -it <Container ID> sh`

Si el contenedor ya está en ejecución y queremos conectarnos a él, podemos usar el comando `exec`:

_en otro terminal_

```bash
docker ps
docker exec -it <CONTAINER ID> sh
```
