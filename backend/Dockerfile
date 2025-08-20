# 🏎️ CarTech Platform Backend Dockerfile
FROM node:18-alpine

# 📦 Set working directory
WORKDIR /app

# 📋 Copy package files
COPY package*.json ./

# 🔧 Install dependencies
RUN npm ci --only=production

# 📁 Copy source code
COPY src/ ./src/

# 👤 Create non-root user
RUN addgroup -g 1001 -S cartech && \
    adduser -S cartech -u 1001

# 🔐 Set ownership
RUN chown -R cartech:cartech /app
USER cartech

# 🌐 Expose port
EXPOSE 3000

# 🚀 Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 🏁 Start application
CMD ["node", "src/index.js"]
