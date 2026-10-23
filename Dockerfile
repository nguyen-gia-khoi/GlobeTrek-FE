# Build the Vite app, then serve the static files with Nginx.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines these at build time. Pass them with --build-arg or Compose.
ARG VITE_BASE_URL
ARG VITE_REDIRECT_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_REDIRECT_URL=$VITE_REDIRECT_URL

RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
