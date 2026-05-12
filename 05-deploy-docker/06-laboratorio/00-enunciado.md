# 06 Laboratorio — Dockerizando una aplicación fullstack

## El escenario

Eres el DevOps del equipo. Los desarrolladores te han entregado **MangaTracker**, una app fullstack para gestionar un catálogo de series manga:

- El **backend** es una API REST con **.NET 8** y **PostgreSQL**.
- El **frontend** es una web con **Astro** (modo SSR con adaptador Node.js).

Ambas apps están terminadas y funcionan en local. Tu trabajo es **escribir los `Dockerfile`** para empaquetar cada una en una imagen Docker lista para producción.

La base de datos ya corre en un contenedor PostgreSQL que se levanta vía el `docker-compose.yml` raíz del laboratorio. Tú no tienes que dockerizar la base de datos.

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
│   ├── MangaApi.csproj
│   ├── Program.cs
│   └── appsettings.json
└── frontend/                   ← App Astro SSR — ESCRIBE AQUÍ EL Dockerfile
    ├── src/
    ├── astro.config.ts
    ├── package.json
    └── .env.example
```

---

## Tu misión

Crea un `Dockerfile` dentro de `backend/` y otro dentro de `frontend/`.

Cuando ambos Dockerfiles estén escritos, deberías poder ejecutar desde la raíz del laboratorio:

```bash
docker compose up --build
```

Y tener la aplicación completa funcionando:

- Frontend → [http://localhost:4321](http://localhost:4321)
- Backend (API) → [http://localhost:8080/api/manga](http://localhost:8080/api/manga)
- Swagger → [http://localhost:8080/swagger](http://localhost:8080/swagger)

---

## Lo que debes averiguar (sin respuestas aquí)

### Para el backend (.NET 8)

- ¿Qué imagen base oficial de Microsoft necesitas para **compilar** una app .NET 8?
- ¿Y para **ejecutar** el artefacto ya compilado? (Pista: no necesitas el SDK completo en producción.)
- ¿Qué comando de `dotnet` restaura dependencias, compila y publica la app en modo Release?
- ¿En qué carpeta deja el artefacto publicado y cómo lo copias a la imagen final?
- ¿Qué puerto usa .NET por defecto en Docker? (Revisa `ASPNETCORE_URLS` en el `docker-compose.yml`.)
- ¿Cómo arrancas la aplicación? El binario principal se llama `MangaApi.dll`.

### Para el frontend (Astro SSR + Node.js)

- Astro necesita Node.js para compilarse **y** para ejecutarse. ¿Qué imagen Alpine de Node.js tiene sentido usar?
- ¿Cuál es la diferencia entre `npm install` y `npm ci`? ¿Cuál deberías usar en un Dockerfile?
- El comando `npm run build` genera el servidor en `./dist/server/entry.mjs`. ¿Cómo lo arrancas?
- El adaptador Node.js de Astro necesita las variables de entorno `HOST` y `PORT` en tiempo de ejecución. Revisa el `docker-compose.yml` para saber qué valores establecer.
- ¿Tiene sentido incluir `node_modules` en la imagen final usando multi-stage build?

---

## Requisitos de los Dockerfiles

- **Multi-stage build** obligatorio en ambos casos: una etapa para compilar, otra limpia para ejecutar.
- Las imágenes de producción deben ser lo más ligeras posible (usa variantes `alpine` cuando puedas).
- No copies ficheros innecesarios a la imagen final (código fuente, herramientas de desarrollo, tests...).
- El `EXPOSE` debe reflejar el puerto real en el que escucha el proceso.
- Cada imagen debe arrancar sola con `docker run` sin parámetros adicionales (salvo las variables de entorno).

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
cp .env.example .env
npm install
npm run dev
# Frontend disponible en http://localhost:4321
```

---

## Criterios de evaluación

| Criterio                                                         | Puntos |
| ---------------------------------------------------------------- | ------ |
| Dockerfile backend funciona y arranca la API                     | 30     |
| Dockerfile frontend funciona y sirve la web                      | 30     |
| Multi-stage build aplicado correctamente en ambos                | 20     |
| Imágenes finales sin código fuente ni dependencias de desarrollo | 10     |
| `docker compose up --build` levanta todo sin errores             | 10     |

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
<summary>🔴 Pista 3 — Arrancar Astro en Docker</summary>

```dockerfile
CMD ["node", "./dist/server/entry.mjs"]
```

El servidor necesita `ENV HOST=0.0.0.0` para aceptar conexiones desde fuera del contenedor.

</details>
