# ===== Build =====
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== Runtime =====
FROM node:20
WORKDIR /app
ENV NODE_ENV=production
# instala o servidor estático
RUN npm i -g serve
# copia somente os arquivos prontos do Vite
COPY --from=build /app/dist ./dist
# porta "padrão" (Railway injeta $PORT em runtime)
EXPOSE 3000
# SPA fallback (-s) e escuta na porta do Railway
CMD sh -c "serve -s dist -l ${PORT:-3000}"
