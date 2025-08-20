#!/bin/bash
# 🚀 CarTech Platform Deployment Script

echo "🚀 Deploying CarTech Platform..."

# 🔍 Environment Check
if [ -z "$ENVIRONMENT" ]; then
    echo "⚠️ ENVIRONMENT variable not set. Defaulting to 'staging'"
    ENVIRONMENT="staging"
fi

echo "🌍 Deploying to: $ENVIRONMENT"

# 🏗️ Build Applications
echo "🏗️ Building applications..."
npm run build

# 🐳 Build Docker Images
echo "🐳 Building Docker images..."
docker build -t cartech/backend:$ENVIRONMENT ./backend
docker build -t cartech/web:$ENVIRONMENT ./web

# 📤 Push to Registry
echo "📤 Pushing to container registry..."
docker push cartech/backend:$ENVIRONMENT
docker push cartech/web:$ENVIRONMENT

# ☸️ Deploy to Kubernetes
echo "☸️ Deploying to Kubernetes..."
kubectl set image deployment/cartech-backend cartech-backend=cartech/backend:$ENVIRONMENT
kubectl set image deployment/cartech-web cartech-web=cartech/web:$ENVIRONMENT

# 🔄 Wait for Rollout
echo "🔄 Waiting for deployment rollout..."
kubectl rollout status deployment/cartech-backend
kubectl rollout status deployment/cartech-web

# 🏥 Health Check
echo "🏥 Performing health checks..."
kubectl get pods -l app=cartech-backend
kubectl get pods -l app=cartech-web

echo "✅ Deployment complete!"
echo "🌐 Application URL: https://cartech-platform.com"
