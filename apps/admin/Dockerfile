# BILLMINT SUPER ADMIN CONSOLE DOCKERFILE
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/admin ./apps/admin
COPY packages ./packages

RUN npm ci
RUN npm run build --prefix apps/admin

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
