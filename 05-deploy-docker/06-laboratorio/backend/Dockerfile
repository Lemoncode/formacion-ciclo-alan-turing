# ── Etapa 1: compilación ────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Restaurar dependencias primero para aprovechar la caché de capas
COPY *.csproj ./
RUN dotnet restore

# Copiar el resto del código y publicar en modo Release
COPY . .
RUN dotnet publish -c Release -o /out

# ── Etapa 2: imagen de producción ────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "MangaApi.dll"]
