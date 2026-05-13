# 06 Laboratorio — Dockerizando una aplicación fullstack

## El escenario

Eres el DevOps del equipo. Los desarrolladores te han entregado **MangaTracker**, una app fullstack para gestionar un catálogo de series manga:

- El **backend** es una API REST con **.NET 8** que almacena los datos **en memoria** (sin base de datos).
- El **frontend** es una web con **Astro** compilada a HTML/CSS/JS estático.

Ambas apps están terminadas y funcionan en local. Tu trabajo es **escribir un único `Dockerfile`** en la **raíz del laboratorio** que:

1. Compile el frontend Astro en archivos estáticos.
2. Compile y publique el backend .NET.
3. Produzca una imagen final donde el servidor .NET (Kestrel) sirva tanto la API como los archivos estáticos del frontend.

Así, en producción solo hay **un contenedor** que lo hace todo.

---

## Estructura del proyecto

```
06-laboratorio/
├── 00-enunciado.md
├── Dockerfile                  ← ESCRIBE AQUÍ EL Dockerfile
├── backend/                    ← API .NET 8
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── wwwroot/                ← aquí irán los archivos estáticos del frontend
│   ├── MangaApi.csproj
│   ├── Program.cs
│   └── appsettings.json
└── frontend/                   ← App Astro estática (sin Dockerfile propio)
    ├── src/
    ├── astro.config.ts
    └── package.json
```

---

## Tu misión

Crea el `Dockerfile` en la raíz del laboratorio con **tres etapas**:

| Etapa | Imagen base                        | Qué hace                                                                  |
| ----- | ---------------------------------- | ------------------------------------------------------------------------- |
| 1     | `node:24-alpine`                   | Instala deps del frontend y ejecuta `npm run build`                       |
| 2     | `mcr.microsoft.com/dotnet/sdk:8.0` | Compila y publica el backend en modo Release                              |
| 3     | `mcr.microsoft.com/dotnet/sdk:8.0` | Imagen final: copia el binario .NET + el `dist/` de Astro como `wwwroot/` |

---

## Lo que debes averiguar (sin respuestas aquí)

### Para compilar el frontend (etapa Node)

- El contexto del Dockerfile es la raíz `06-laboratorio/`. ¿Cómo copias los ficheros de `frontend/`?
- ¿Cuál es la diferencia entre `npm install` y `npm ci`? ¿Cuál deberías usar en un Dockerfile?
- El comando `npm run build` genera archivos estáticos en `./dist/`. ¿Cómo los copias a la etapa final?
- El frontend usa la configuración de proxy de Vite para redirigir las peticiones `/api` al backend durante el desarrollo. En Docker no necesitas preocuparte por esto: el .NET sirve `/api/manga` directamente y el build estático funciona sin pasos adicionales.

### Para compilar el backend .NET (etapa SDK)

- ¿Qué imagen base oficial de Microsoft necesitas para **compilar** una app .NET 8?
- ¿Y para **ejecutar** el artefacto ya compilado? (Pista: no necesitas el SDK completo en producción.)
- ¿Qué comando de `dotnet` restaura dependencias, compila y publica la app en modo Release?
- ¿En qué carpeta deja el artefacto publicado y cómo lo copias a la imagen final?

### Para la imagen final (etapa ASP.NET runtime)

- ¿Cómo copias los archivos estáticos del frontend a `./wwwroot/` dentro de la imagen?
- ¿Cómo arrancas la aplicación con `CMD`? El binario principal se llama `MangaApi.dll`.

---

## Requisitos del Dockerfile

- **Multi-stage build** de tres etapas: Node (frontend) → .NET SDK (backend) → ASP.NET runtime.
- La imagen final solo contiene el binario compilado y los archivos estáticos: sin código fuente, sin SDK, sin `node_modules`.
- Usa `CMD` para arrancar el proceso.

---

## Probar en local con Docker

Una vez escrito el Dockerfile, construye la imagen desde la **raíz del laboratorio**:

```bash
docker build -t manga-tracker:1 .
```

> `-t`: Asigna nombre y etiqueta a la imagen (`nombre:etiqueta`).
> `.`: El contexto de build es el directorio actual (la raíz del laboratorio).

Ejecuta el contenedor mapeando el puerto y pasando la variable de entorno que necesita .NET:

```bash
docker run --name manga-tracker --rm -d \
  -p 3000:3000 \
  -e ASPNETCORE_HTTP_PORTS=3000 \
  manga-tracker:1
```

> `--rm`: Elimina el contenedor automáticamente al detenerlo.
> `-d`: Ejecuta en segundo plano (detached).
> `-p 3000:3000`: Mapea el puerto `local:contenedor`.
> `-e`: Inyecta una variable de entorno en el contenedor.

Si todo va bien tendrás disponible:

- Frontend + API → [http://localhost:3000](http://localhost:3000)

Para detener el contenedor:

```bash
docker stop manga-tracker
```

## Pistas

### Pista 1 — Imagen base para .NET

La imagen oficial de Microsoft para .NET 8 (compilar y ejecutar) es:

- `mcr.microsoft.com/dotnet/sdk:8.0`

Puedes reutilizarla en la etapa intermedia y en la imagen final con un alias:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS base
```

### Pista 2 — Cómo compilar .NET

Usa una ruta relativa en `-o` para que el artefacto quede dentro del `WORKDIR`:

```dockerfile
RUN dotnet publish -c Release -o out
```

### Pista 3 — Cómo arrancar el servidor .NET

```dockerfile
CMD ["dotnet", "MangaApi.dll"]
```

### Pista 4 — Dónde copiar los archivos estáticos del frontend

Copia el resultado del build de Astro (`dist/`) a `wwwroot/` dentro de la imagen final:

```dockerfile
COPY --from=build-frontend /usr/app/dist ./wwwroot
```

---

## Despliegue en Render

Una vez que la imagen funciona en local, puedes desplegar en [Render](https://render.com):

1. Sube el repositorio a GitHub.
2. En Render, crea un nuevo **Web Service** y conecta el repositorio.
