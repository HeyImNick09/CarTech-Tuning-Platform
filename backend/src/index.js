// 🏎️ CarTech Platform - Backend Entry Point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const logger = require('./utils/logger');
const config = require('./config');

// 🌐 API Routes
const authRoutes = require('./api/routes/auth');
const ecuRoutes = require('./api/routes/ecu');
const dynoRoutes = require('./api/routes/dyno');
const tuningRoutes = require('./api/routes/tuning');
const vehicleRoutes = require('./api/routes/vehicle');
const performanceRoutes = require('./api/routes/performance');

// 🔧 Services
const ECUService = require('./services/ecu/ecuService');
const DynoService = require('./services/dyno/dynoService');
const SafetyService = require('./services/safety/safetyService');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// 🛡️ Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true
}));

// 📊 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT) || 1000,
  message: '🚨 Too many requests, please try again later'
});
app.use('/api/', limiter);

// 🗂️ General Middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🏁 Health Check
app.get('/health', (req, res) => {
  res.json({
    status: '🟢 Healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      ecu: ECUService.isConnected(),
      dyno: DynoService.isConnected(),
      safety: SafetyService.isActive()
    }
  });
});

// 🌐 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ecu', ecuRoutes);
app.use('/api/dyno', dynoRoutes);
app.use('/api/tuning', tuningRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/performance', performanceRoutes);

// 📡 WebSocket Real-time Communication
io.on('connection', (socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);

  // 🚗 ECU Data Stream
  socket.on('subscribe_ecu_data', (vehicleId) => {
    socket.join(`ecu_${vehicleId}`);
    logger.info(`📊 Client subscribed to ECU data for vehicle: ${vehicleId}`);
  });

  // 🏁 Dyno Data Stream
  socket.on('subscribe_dyno_data', (sessionId) => {
    socket.join(`dyno_${sessionId}`);
    logger.info(`📈 Client subscribed to dyno data for session: ${sessionId}`);
  });

  // 🛡️ Safety Alerts
  socket.on('subscribe_safety_alerts', (vehicleId) => {
    socket.join(`safety_${vehicleId}`);
    logger.info(`🚨 Client subscribed to safety alerts for vehicle: ${vehicleId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
  });
});

// 🚨 Error Handling
app.use((err, req, res, next) => {
  logger.error('🚨 Unhandled error:', err);
  res.status(500).json({
    error: '🚨 Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 🚫 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: '🚫 Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// 🚀 Server Startup
const PORT = process.env.API_PORT || 3000;
const HOST = process.env.API_HOST || 'localhost';

server.listen(PORT, HOST, () => {
  logger.info(`🏎️ CarTech Platform Backend running on http://${HOST}:${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔧 ECU Communication: ${process.env.SAFETY_MODE === 'enabled' ? '🛡️ Safe Mode' : '⚡ Performance Mode'}`);
});

// 🛡️ Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('🏁 Process terminated');
    process.exit(0);
  });
});

module.exports = { app, io };
