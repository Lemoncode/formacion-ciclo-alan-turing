FROM node:24-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Compilamos frontend
FROM base AS build-front
COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

# Release final (lo que realmente necesitamos subir)
FROM base AS release
ENV STATIC_FILES_PATH=./public
COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY ./server/package*.json ./
COPY ./server/index.js ./
RUN npm ci

CMD ["node", "index.js"]
