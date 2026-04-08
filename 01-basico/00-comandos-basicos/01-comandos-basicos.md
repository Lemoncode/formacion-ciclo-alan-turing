# 01 Comandos básicos de Docker

En este ejemplo vamos a aprender y ejecutar los comandos más fundamentales de Docker.

## 1. Trabajar con imágenes

Primero, comprobaremos las **imágenes** que tenemos descargadas o construidas (`built images`) disponibles en local:

```bash
docker images
```

¿Cómo descargar una nueva? Podemos usar `docker pull` para descargar imágenes externas preconstruidas. Si no usamos ninguna etiqueta (`tag`), descargará la etiqueta `latest` por defecto:

```bash
docker pull hello-world
```

> **Nota:** `hello-world` es una imagen oficial existente en Docker Hub.
>
> Por defecto, se descargan todas las imágenes del registro público [Docker Hub](https://hub.docker.com/). También puedes [descargar desde un registro diferente](https://docs.docker.com/engine/reference/commandline/pull/#pull-from-a-different-registry) con: `docker pull myregistry.local:5000/testing/test-image`

Vuelve a comprobar las imágenes disponibles y verás que ahora aparece listada:

```bash
docker images
```

## 2. Iniciar y gestionar contenedores

Para ejecutar una imagen necesitamos un contenedor (`container`) de Docker. Para crear un nuevo contenedor basado en una imagen, debemos usar el comando `docker run`. Antes de eso, vamos a listar cuántos contenedores tenemos en nuestro sistema:

```bash
docker ps
docker ps --all
docker ps -a
```

> **Opciones del comando ps (Process Status):**
>
> - `docker ps`: Lista los contenedores actualmente en ejecución.
> - `docker ps -a` (o `--all`): Lista todos los contenedores (activos e inactivos/detenidos).

Vamos a ejecutar la imagen que acabamos de descargar:

```bash
docker run hello-world
```

Esta imagen está programada para ejecutarse, mostrar un mensaje y detenerse inmediatamente. Podemos comprobar que el contenedor se creó y se detuvo con:

```bash
docker ps -a
```

Para volver a iniciar un contenedor que ya está detenido tenemos que usar `docker start` y no `run`, ya que `run` crearía un contenedor completamente nuevo:

```bash
docker start <Container ID> -i
```

> **Opciones del comando start:**
>
> - `-i` (Interactive): Adjunta la entrada estándar (STDIN) del contenedor.
>
> **Nota:** Puedes usar solo los primeros 4 caracteres del `Container ID` en los comandos, en lugar de escribir todo el hash.

Si volviéramos a lanzar un `docker run`, se crearía un contenedor adicional con la misma imagen base:

```bash
docker run hello-world
docker ps -a
```

> **Nota sobre cómo nombrar contenedores:** Docker asigna nombres aleatorios a los contenedores si no especificamos uno. Podemos darle el nombre que queramos utilizando el flag `--name`:
> `docker run --name mi-contenedor hello-world`

## 3. Contenedores en modo interactivo

En muchas ocasiones nos interesará tener una terminal activa dentro de nuestro contenedor.

Por ejemplo, si lanzamos una imagen de Ubuntu básica, esta ejecuta su proceso principal (que en este caso no es bloqueante) y se detiene automáticamente:

```bash
docker run ubuntu
```

Para mantenerlo vivo y poder escribir en él, usamos los flags interactivos y el comando que queremos ejecutar (`sh` o `bash` para abrir la consola del sistema):

```bash
docker run -it ubuntu bash
```

> **Opciones interactivas:**
>
> - `-i`: Mantiene el STDIN abierto.
> - `-t`: Asigna un seudo-TTY (terminal interactiva).
>
> **Nota:** `docker run` descarga la imagen de `ubuntu` de forma automática al no encontrarla en local, aunque no hayamos hecho `docker pull` previamente.

Si el contenedor ya estuviera en ejecución por detrás (por ejemplo, con `-d`), y quisiéramos conectarnos a él en vivo, podríamos usar el comando `exec`:

```bash
docker ps
docker exec -it <CONTAINER ID> sh
```

## 4. Limpieza (Borrando contenedores e imágenes)

Conforme vamos haciendo pruebas, se nos acumulan contenedores parados e imágenes que ya no usamos. Vamos a eliminarlos.

Para eliminar un contenedor individual (primero tiene que estar detenido):

```bash
docker rm <CONTAINER ID>
```

Para hacer limpieza general masiva y borrar todos los contenedores detenidos de golpe:

```bash
docker container prune
```

Finalmente, para eliminar una imagen que ya no necesitamos:

```bash
docker image rm <IMAGE NAME>:<TAG>
# o en su versión abreviada:
docker rmi <IMAGE NAME>:<TAG>
```

## 5. Interfaces gráficas (Docker Desktop y VS Code)

Aunque es fundamental conocer los comandos de consola para entender cómo funciona Docker por debajo y para automatizar procesos, en el día a día podemos realizar todas estas tareas (listar imágenes, arrancar/parar contenedores, ver logs, hacer limpieza o abrir una terminal) de forma completamente visual:

- **Docker Desktop**: Si tienes instalada esta herramienta en local, incluye un panel gráfico (Dashboard) muy intuitivo donde puedes gestionar tus contenedores, imágenes y volúmenes con simples clics.
- **Extensión de Docker para VS Code**: Debido a las políticas de uso de Docker Desktop (que requiere licencia de pago para empresas de gran tamaño o ingresos elevados), es muy común en el entorno profesional utilizar motores alternativos (como OrbStack, Colima o Rancher Desktop). En estos casos, la **extensión oficial de Docker para Visual Studio Code** es el sustituto ideal. Añade un panel en el lateral del editor desde el que puedes desplegar repositorios, encender contenedores, inspeccionarlos o hacer botón derecho > "Attach Shell" de manera súper productiva.
