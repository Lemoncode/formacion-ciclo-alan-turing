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
