# ── Etapa 1: build del frontend Astro (estático) ────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ── Etapa 2: compilación del backend .NET ────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app
COPY backend/*.csproj ./
RUN dotnet restore
COPY backend/ .
RUN dotnet publish -c Release -o /out

# ── Etapa 3: imagen de producción ────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /out .
# Copiar el build estático de Astro a wwwroot para que Kestrel lo sirva
COPY --from=frontend-build /frontend/dist ./wwwroot
EXPOSE 8080
ENTRYPOINT ["dotnet", "MangaApi.dll"]
