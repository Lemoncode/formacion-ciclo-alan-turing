# 02 Upload Docker Hub

En este ejemplo vamos a subir nuestras imágenes de Docker personalizadas a un registro público (Docker Hub) para poder descargarlas y usarlas en cualquier máquina o servidor.

Partiremos del código resultante en el ejemplo `05-deploy-docker/01-docker-image`.

## Paso 1 — Autenticación en Docker Hub

Primero, necesitamos iniciar sesión en el registro de Docker Hub desde nuestra terminal:

```bash
docker login
```

> **Nota:** Por defecto `docker login` apunta al registro oficial `docker.io`. Si en el futuro usas repositorios privados como AWS ACR o Azure Container Registry, el comando sería `docker login <url-del-registry>`.

## Paso 2 — Etiquetado de la imagen (Tagging)

Para poder subir una imagen, debemos etiquetarla (`tag`) con una estructura específica que coincida con tu nombre de usuario y el repositorio de destino:

```bash
# Patrón general
docker tag <app-name>:<tag> <registry>/<user-name>/<app-name>

# Nuestro caso práctico
docker tag my-app:2 <tu-usuario-de-dockerhub>/my-app
```

> **Variables clave:**
>
> - `<tu-usuario-de-dockerhub>`: Tu nombre de usuario real en Docker Hub (ejemplo: `lemoncoders`).
> - Si omites la etiqueta al final de la nueva imagen, Docker asignará automáticamente la etiqueta `latest` por defecto.

Comprueba que la nueva imagen etiquetada aparece correctamente en tu lista local:

```bash
docker images
```

## Paso 3 — Subida de la imagen (Push)

Ahora podemos usar el comando `push` para subir esta etiqueta a la nube de Docker Hub:

```bash
docker push <tu-usuario-de-dockerhub>/my-app
```

Comprueba en tu navegador que la imagen se ha publicado accediendo a:
`https://hub.docker.com/repository/docker/<tu-usuario-de-dockerhub>/my-app/tags`

### Subiendo múltiples etiquetas

Es una excelente práctica no usar solo `latest`, sino mantener un histórico con versiones concretas (p.ej. `v2`). Etiquetemos también nuestra versión específica:

```bash
docker tag my-app:2 <tu-usuario-de-dockerhub>/my-app:2
docker images
docker push <tu-usuario-de-dockerhub>/my-app:2
```

## Paso 4 — Actualización y control de versiones

Imagina que necesitamos realizar un cambio en nuestro código de infraestructura. Vamos a modificar el puerto interno:

_./Dockerfile_

```diff
...

- ENV PORT=8083
+ ENV PORT=8080
CMD ["node", "index.js"]

```

> **Aviso:** Fíjate que mantenemos la sintaxis de array JSON en el comando final `CMD ["node", "index.js"]` como venimos usando.

Construimos la nueva imagen etiquetándola directamente como versión 3 y la subimos:

```bash
docker build -t <tu-usuario-de-dockerhub>/my-app:3 .
docker images
docker push <tu-usuario-de-dockerhub>/my-app:3
```

> **¡Pregunta trampa!** Si acabamos de subir esta versión 3... ¿crees que la etiqueta `latest` que configuramos antes apunta ahora también a la versión 3 automáticamente? 
> 
> ¡La respuesta es **no**! En Docker, la etiqueta `latest` **no** es un puntero mágico que se actualice solo con tu subida más reciente. Es simplemente una cadena de texto más.

Para mantener la coherencia, siempre que publiquemos una nueva versión principal, debemos desplazar y actualizar manualmente la capa `latest` para que los usuarios que descarguen la imagen sin especificar versión se lleven la verdadera última actualización:

```bash
docker tag <tu-usuario-de-dockerhub>/my-app:3 <tu-usuario-de-dockerhub>/my-app:latest
docker images
docker push <tu-usuario-de-dockerhub>/my-app:latest
```

## Paso 5 — Ejecución desde el registro remoto (descarga automática)

Para demostrar la verdadera magia de esto, podemos simular que estamos en un servidor externo completamente vacío.

Detenemos el contenedor si estuviera corriendo y borramos TODAS nuestras imágenes locales:

```bash
docker stop my-app-container

# Borramos todo rastro local
docker rmi my-app:1 my-app:2 <tu-usuario-de-dockerhub>/my-app:latest <tu-usuario-de-dockerhub>/my-app:2 <tu-usuario-de-dockerhub>/my-app:3

docker images
```

Ahora, ejecutamos el servidor apuntando directamente a tu registro público. Al no encontrarla en local, Docker la descargará (`pull`) desde Docker Hub de manera automática:

```bash
docker run --name my-app-container --rm -d -p 8080:8080 <tu-usuario-de-dockerhub>/my-app:3
```

> **Consejo - Arquitecturas cruzadas (M1/M2 vs Windows/Intel):**
> Dependiendo de la arquitectura de la CPU con la que generaste el _build_ (por ejemplo un Mac con procesador ARM), puede que el servidor (que habitualmente es Intel/AMD x86) tenga problemas al arrancar. Para forzar una compilación compatible en servidores Linux tradicionales, en tu máquina podrías haber construido la imagen con el flag de plataforma:
> `--platform linux/amd64` tanto en el comando `build` como en el `run`.

Abre `http://localhost:8080` y comprobarás que el despliegue funciona a la perfección.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
