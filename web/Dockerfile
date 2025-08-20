# 🏎️ CarTech Platform Web Dockerfile
FROM node:18-alpine as builder

# 📦 Set working directory
WORKDIR /app

# 📋 Copy package files
COPY package*.json ./

# 🔧 Install dependencies
RUN npm ci

# 📁 Copy source code
COPY src/ ./src/
COPY public/ ./public/

# 🚀 Build application
RUN npm run build

# 🌐 Production stage
FROM nginx:alpine

# 📁 Copy built files
COPY --from=builder /app/build /usr/share/nginx/html

# 🔧 Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# 🌐 Expose port
EXPOSE 80

# 🏁 Start nginx
CMD ["nginx", "-g", "daemon off;"]
