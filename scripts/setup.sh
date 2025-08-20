#!/bin/bash
# 🏎️ CarTech Platform Setup Script

echo "🏎️ Setting up CarTech Tuning Platform..."

# 🔧 Install Backend Dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# 💻 Install Web Dependencies
echo "🌐 Installing web dependencies..."
cd web
npm install
cd ..

# 📱 Install Mobile Dependencies
echo "📱 Installing mobile dependencies..."
cd mobile/cartech-customer
npm install
cd ../cartech-technician
npm install
cd ../..

# 🗃️ Setup Database
echo "🗃️ Setting up database..."
cd backend
npm run migrate
npm run seed
cd ..

# 🔐 Setup Environment
echo "🔐 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️ Please configure your .env file with actual values"
fi

# 🐳 Setup Docker
echo "🐳 Building Docker containers..."
docker-compose build

echo "✅ Setup complete! Run 'npm run dev' to start development"
echo "🌐 Web: http://localhost:3001"
echo "🔧 API: http://localhost:3000"
echo "📊 Grafana: http://localhost:3002"
