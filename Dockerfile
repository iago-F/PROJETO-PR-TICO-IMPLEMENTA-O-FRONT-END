# ====== STAGE 1: build ======
FROM node:20-alpine AS builder
WORKDIR /app

# Copia manifests e instala dependências (cache eficiente)
COPY package.json package-lock.json* ./
RUN npm ci

# Copia o restante e builda
COPY . .
# Se tiver .env.production, o Vite irá embutir no build
RUN npm run build

# ====== STAGE 2: servir estático com Nginx ======
FROM nginx:1.27-alpine AS runner
# Remove conf default e usa a nossa
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/site.conf

# Copia o build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
CMD ["nginx","-g","daemon off;"]
