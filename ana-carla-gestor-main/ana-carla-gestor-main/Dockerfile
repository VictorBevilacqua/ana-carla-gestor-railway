# Etapa de build
FROM node:20 AS build
WORKDIR /app

# Copia os arquivos de configuração e instala dependências
COPY package*.json ./
RUN npm ci

# Copia o restante do código e executa o build do Vite
COPY . .
RUN npm run build

# Etapa de execução
FROM node:20
WORKDIR /app
ENV NODE_ENV=production

# Copia o resultado do build
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# Expõe a porta usada pelo Railway
EXPOSE 3000

# Comando de start (pode ajustar se seu package.json for diferente)
CMD ["npx", "serve", "dist", "-l", "3000"]
