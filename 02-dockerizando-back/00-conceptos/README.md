# 00 Conceptos: Dockerizando el Backend

## ¿Por qué dockerizar el backend?

Cuando trabajamos en equipos multidisciplinares, a menudo nos encontramos con separaciones claras entre frontend y backend. En estos escenarios, depender de instalaciones locales tradicionales genera mucha fricción. Los principales problemas aparecen cuando:

- **Ritmos de entrega diferentes:** Los equipos de frontend y backend trabajan en paralelo pero avanzan a distintas velocidades, necesitando disponer de un backend funcional en local sin depender de que este se publique.
- **Fricción con tecnologías ajenas:** El backend puede estar construido con lenguajes (Java, Python, Go, PHP) o requerir bases de datos complejas que el desarrollador frontend no domina y no debería tener que instalar ni configurar manualmente.
- **Conflictos de dependencias y versiones:** Incluso si ambos usan la misma tecnología (p. ej. Node.js), el proyecto frontend podría requerir Node 20 y el backend Node 14. Gestionar estos conflictos en la misma máquina es engorroso y propenso a errores.
- **Onboarding tedioso:** Un nuevo desarrollador frontend no debería perder horas o días instalando dependencias, levantando motores de bases de datos y configurando el entorno del backend para poder empezar a trabajar en sus pantallas.
- **Entornos incompatibles ("En mi máquina funciona"):** Lo que funciona perfectamente en el Mac del desarrollador backend podría fallar estrepitosamente en el Windows del desarrollador frontend o en el entorno de producción.

La solución es aislar y empaquetar el backend en una **imagen Docker**, convirtiéndolo a efectos prácticos en una **caja negra** autosuficiente. De esta forma, el equipo de frontend puede levantar toda la API y sus dependencias subyacentes ejecutando un simple comando (usando `docker-compose`), inyectando las variables de entorno necesarias y olvidándose de cómo está montada por dentro.

Esto nos permite **centrarnos exclusivamente en el desarrollo de nuestra parte** (como el frontend), con la garantía absoluta de que el servidor responderá correctamente como un servicio más.

> **Principio:** Si funciona en el contenedor, funciona en cualquier sitio (y para cualquier compañero de equipo).

---

## El Dockerfile: la receta de la imagen

Un `Dockerfile` es un fichero de texto que describe, paso a paso, cómo construir la imagen de nuestra aplicación:

```dockerfile
# 1. Imagen base: Node.js 24 sobre Alpine (ligera)
FROM node:24-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar dependencias e instalar (capa separada para aprovechar caché)
COPY package*.json ./
RUN npm ci

# 4. Copiar el resto del código
COPY . .

# 5. Puerto que expone el contenedor
EXPOSE 3000

# 6. Comando de arranque
CMD ["npm", "start"]
```

### Por qué `COPY package*.json` antes que `COPY . .`

Docker construye las imágenes en capas. Si copiamos primero solo el `package.json` e instalamos dependencias, Docker reutiliza esa capa en las siguientes builds mientras no cambien las dependencias. Así, las rebuilds al modificar código son mucho más rápidas.

---

## Construyendo y publicando la imagen

En esta fase nos centraremos en compilar la imagen de nuestro backend y subirla a un registro como Docker Hub. Más adelante, en el siguiente ejemplo, veremos cómo utilizar esta imagen junto con una base de datos usando Docker Compose.

### 1. Construir la imagen (Build)

Para crear la imagen a partir de nuestro `Dockerfile`, empleamos el comando `docker build`. Es importante asignarle una etiqueta (tag) que incluya `tu nombre de usuario de Docker Hub` para poder publicarla después.

```bash
docker build -t <tu-usuario>/coffe-backend:1.0.0 .
```

_(El `.` al final es crucial: le indica a Docker que busque el `Dockerfile` y los archivos en el directorio actual)._

### 2. Autenticarse en Docker Hub

Antes de subir la imagen, debemos asegurarnos de haber iniciado sesión en nuestra cuenta de Docker Hub desde la línea de comandos:

```bash
docker login
```

### 3. Subir la imagen (Push)

Una vez construida la imagen y validada la sesión, la subimos al registro. De esta manera, cualquier miembro del equipo (o nosotros en otro entorno) podrá descargarla directamente sin necesidad de compilar el código fuente.

```bash
docker push <tu-usuario>/coffe-backend:1.0.0
```

---

## Resumen del flujo

```
Dockerfile  ──build──▶  Imagen Local  ──push──▶  Docker Hub
```

En el siguiente ejemplo veremos cómo tomar una imagen como esta y levantarla interconectada con una base de datos MongoDB utilizando **Docker Compose**.
