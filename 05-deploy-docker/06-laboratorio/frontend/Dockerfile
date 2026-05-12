# ── Etapa 1: compilación ────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias primero para aprovechar la caché de capas
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y compilar la app Astro
COPY . .
RUN npm run build

# ── Etapa 2: imagen de producción ────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copiar el servidor compilado y las dependencias de producción
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4321

# El adaptador Node.js de Astro necesita HOST para escuchar en todas las interfaces
ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["node", "./dist/server/entry.mjs"]
