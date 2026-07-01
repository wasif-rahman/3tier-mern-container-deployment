# Stage 1: Build React Application
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve React Application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration if routing was required, but default suffices for single page
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
