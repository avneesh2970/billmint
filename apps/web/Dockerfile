# BILLMINT WEB MARKETING APP DOCKERFILE
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web ./apps/web
COPY packages ./packages

RUN npm ci
RUN npm run build --prefix apps/web

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
