# 06 Laboratorio — Dockerizando una aplicación fullstack

## El escenario

Eres el DevOps del equipo. Los desarrolladores te han entregado **MangaTracker**, una app fullstack para gestionar un catálogo de series manga:

- El **backend** es una API REST con **.NET 8** y **PostgreSQL**.
- El **frontend** es una web con **Astro** compilada a HTML/CSS/JS estático.

Ambas apps están terminadas y funcionan en local. Tu trabajo es **escribir un único `Dockerfile`** (en `backend/`) que:

1. Compile el frontend Astro en archivos estáticos.
2. Compile y publique el backend .NET.
3. Produzca una imagen final donde el servidor .NET (Kestrel) sirva tanto la API como los archivos estáticos del frontend.

Así, en producción solo hay **dos contenedores**: la base de datos y el backend (que hace de servidor web también).

---

## Estructura del proyecto

```
06-laboratorio/
├── 00-enunciado.md
├── docker-compose.yml          ← ya proporcionado, úsalo para orquestar todo
├── backend/                    ← API .NET 8 — ESCRIBE AQUÍ EL Dockerfile
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

Crea un `Dockerfile` dentro de `backend/` con **tres etapas**:

| Etapa | Imagen base                           | Qué hace                                                                  |
| ----- | ------------------------------------- | ------------------------------------------------------------------------- |
| 1     | `node:20-alpine`                      | Instala deps del frontend y ejecuta `npm run build`                       |
| 2     | `mcr.microsoft.com/dotnet/sdk:8.0`    | Restaura deps y publica el backend en modo Release                        |
| 3     | `mcr.microsoft.com/dotnet/aspnet:8.0` | Imagen final: copia el binario .NET + el `dist/` de Astro como `wwwroot/` |

El contexto de build de Docker es la **raíz del laboratorio** (`06-laboratorio/`), por lo que puedes acceder tanto a `frontend/` como a `backend/` desde el Dockerfile.

Cuando el Dockerfile esté escrito, deberías poder ejecutar desde la raíz del laboratorio:

```bash
docker compose up -d --build
```

Y tener la aplicación completa funcionando:

- Frontend + API → [http://localhost:8080](http://localhost:8080)
- Swagger → [http://localhost:8080/swagger](http://localhost:8080/swagger)

---

## Lo que debes averiguar (sin respuestas aquí)

### Para compilar el frontend (etapa Node)

- El contexto del Dockerfile es la raíz `06-laboratorio/`. ¿Cómo copias los ficheros de `frontend/`?
- ¿Cuál es la diferencia entre `npm install` y `npm ci`? ¿Cuál deberías usar en un Dockerfile?
- El comando `npm run build` genera archivos estáticos en `./dist/`. ¿Cómo los copias a la etapa final?

### Para compilar el backend .NET (etapa SDK)

- ¿Qué imagen base oficial de Microsoft necesitas para **compilar** una app .NET 8?
- ¿Y para **ejecutar** el artefacto ya compilado? (Pista: no necesitas el SDK completo en producción.)
- ¿Qué comando de `dotnet` restaura dependencias, compila y publica la app en modo Release?
- ¿En qué carpeta deja el artefacto publicado y cómo lo copias a la imagen final?

### Para la imagen final (etapa ASP.NET runtime)

- ¿Cómo copias los archivos estáticos del frontend a `./wwwroot/` dentro de la imagen?
- ¿Qué puerto usa .NET? Revisa `ASPNETCORE_URLS` en el `docker-compose.yml`.
- ¿Cómo arrancas la aplicación? El binario principal se llama `MangaApi.dll`.
- El backend tiene `UseDefaultFiles()` y `UseStaticFiles()` configurados: sirve automáticamente `wwwroot/index.html` cuando accedes a `/`.

---

## Requisitos del Dockerfile

- **Multi-stage build** de tres etapas: Node (frontend) → .NET SDK (backend) → ASP.NET runtime.
- La imagen final solo contiene el binario compilado y los archivos estáticos: sin código fuente, sin SDK, sin `node_modules`.
- El `EXPOSE` debe reflejar el puerto real en el que escucha el proceso.

---

## Cómo arrancar el entorno de desarrollo (sin Docker)

Si quieres probar que las apps funcionan antes de dockerizarlas:

**PostgreSQL (Docker):**

```bash
docker run -d \
  --name manga-db \
  -e POSTGRES_DB=mangadb \
  -e POSTGRES_USER=manga_user \
  -e POSTGRES_PASSWORD=manga_password \
  -p 5432:5432 \
  postgres:16-alpine
```

**Backend:**

```bash
cd backend
dotnet run
# API disponible en http://localhost:8080
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# Frontend disponible en http://localhost:4321 (habla con el backend en localhost:8080)
```

---

## Criterios de evaluación

| Criterio                                                      | Puntos |
| ------------------------------------------------------------- | ------ |
| Dockerfile backend funciona y arranca la API                  | 25     |
| El frontend compilado queda en `wwwroot/` dentro de la imagen | 25     |
| Multi-stage build de 3 etapas aplicado correctamente          | 20     |
| Imagen final sin código fuente ni dependencias de desarrollo  | 20     |
| `docker compose up --build` levanta todo sin errores          | 10     |

---

## Pistas de urgencia

> Descomenta solo si estás bloqueado más de 30 minutos en un punto concreto.

<details>
<summary>🔴 Pista 1 — Imágenes base para .NET</summary>

Las imágenes oficiales de Microsoft para .NET 8 en Docker Hub son:

- Para compilar: `mcr.microsoft.com/dotnet/sdk:8.0`
- Para ejecutar: `mcr.microsoft.com/dotnet/aspnet:8.0`

</details>

<details>
<summary>🔴 Pista 2 — Publicar y ejecutar .NET</summary>

```dockerfile
RUN dotnet publish -c Release -o /out
# ...
ENTRYPOINT ["dotnet", "MangaApi.dll"]
```

</details>

<details>
<summary>🔴 Pista 3 — Copiar el frontend a wwwroot</summary>

```dockerfile
COPY --from=frontend-build /frontend/dist ./wwwroot
```

Kestrel servirá automáticamente estos archivos gracias a `UseStaticFiles()` y `UseDefaultFiles()` en `Program.cs`.

</details>
