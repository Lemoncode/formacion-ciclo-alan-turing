# 03 Persistencia de datos con Volúmenes de Docker

En el ejemplo anterior vimos cómo, al destruir un contenedor de MongoDB, toda nuestra base de datos desaparecía. Para aplicaciones en producción (o simplemente para no perder nuestro trabajo durante el desarrollo), esto es un problema crítico.

La solución recomendada por Docker para persistir datos más allá del ciclo de vida del contenedor son los **Volúmenes (Docker Volumes)**.

## 1. Crear un volumen en Docker

Primero, vamos a crear un espacio de almacenamiento gestionado por Docker en nuestra máquina host (tu ordenador). Éste espacio actuará como un disco duro externo virtual.

```bash
docker volume create mi-volumen-mongo
```

Podemos comprobar y listar los volúmenes que tenemos creados en el sistema con:

```bash
docker volume ls
```

## 2. Lanzar MongoDB conectando el volumen

> **Nota importante:** Asegúrate de detener y eliminar el contenedor del ejemplo anterior antes de continuar, o Docker te dará un error indicando que el nombre `mi-servidor-mongo` ya está en uso. Puedes hacerlo con:
>
> ```bash
> docker stop mi-servidor-mongo
> docker rm mi-servidor-mongo
> ```

A continuación, vamos a montar nuestro servidor de MongoDB, pero esta vez le indicaremos a Docker que conecte nuestro nuevo volumen a la ruta interna donde MongoDB guarda físicamente los datos (archivos `.bson` y `.wt`).

Usaremos el **flag `-v <nombre_volumen>:<ruta_contenedor>`**:

```bash
docker run -d --name mi-servidor-mongo -p 27017:27017 -v mi-volumen-mongo:/data/db mongo
```

> **Nota:** La ruta `/data/db` es el directorio estándar por defecto que usa la imagen oficial de MongoDB dentro de su sistema de archivos linux para almacenar las bases de datos.

## 3. Insertar datos de prueba

Vamos a insertar algunos datos simples en nuestro contenedor para comprobar la persistencia:

```bash
docker exec -it mi-servidor-mongo mongosh
```

Una vez dentro de la consola de MongoDB, insertamos nuestros datos de prueba:

```javascript
use curso_docker
db.alumnos.insertOne({ nombre: "Daniel", curso: "Docker" })
db.alumnos.insertOne({ nombre: "Laura", curso: "Kubernetes" })
exit
```

Si abres **MongoDB Compass** (`mongodb://localhost:27017`), podrás comprobar que la base de datos `curso_docker` con la información de los alumnos se ha creado correctamente.

> **Alternativa con interfaz gráfica:**
> También puedes insertar estos datos directamente usando **MongoDB Compass**. Solo tendrías que crear la base de datos `curso_docker`, la colección `alumnos`, pulsar en "ADD DATA" -> "Insert Document" y pegar el siguiente array en formato JSON (asegúrate de representarlo como un array de objetos):
> ```json
> [
>   {
>     "nombre": "Daniel",
>     "curso": "Docker"
>   },
>   {
>     "nombre": "Laura",
>     "curso": "Kubernetes"
>   }
> ]
> ```

## 4. La prueba de fuego: Destruir el contenedor

Ahora vamos a simular el desastre. Detenemos y eliminamos por completo nuestro contenedor:

```bash
docker stop mi-servidor-mongo
docker rm mi-servidor-mongo
```

En este punto, si intentas interactuar o recargar datos en MongoDB Compass, dará error porque el servidor ya no existe.

## 5. Crear un nuevo contenedor y rescatar los datos

Vamos a arrancar un **contenedor completamente nuevo**, de hecho, incluso le vamos a poner otro nombre distinto, pero la clave está en conectarle el **mismo volumen** que usamos en el paso 2:

```bash
docker run -d --name mi-nuevo-servidor-mongo -p 27017:27017 -v mi-volumen-mongo:/data/db mongo
```

Vuelve a **MongoDB Compass** y haz clic en Conectar de nuevo.

**¡Magia!** 🎉 Toda tu base de datos `curso_docker` con los alumnos está ahí intacta. El nuevo contenedor ha montado el volumen, ha detectado los archivos de base de datos preexistentes y ha iniciado el sistema exactamente donde se dejó. ¡Nuestros datos ya son persistentes y están a salvo!

## 6. Limpieza total (Opcional)

Si has terminado la práctica y quieres dejar tu sistema limpio de contenedores y datos residuales que puedan consumir espacio:

```bash
# Detener y borrar el contenedor actual
docker stop mi-nuevo-servidor-mongo
docker rm mi-nuevo-servidor-mongo

# Por último, destruimos explícitamente el volumen con todos sus ficheros
docker volume rm mi-volumen-mongo
```
