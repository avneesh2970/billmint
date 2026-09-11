# BILLMINT CLIENT DASHBOARD DOCKERFILE
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/dashboard ./apps/dashboard
COPY packages ./packages

RUN npm ci
RUN npm run build --prefix apps/dashboard

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
