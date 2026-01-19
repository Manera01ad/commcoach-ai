console.log('--- BACKEND STARTING ---');
// Load environment variables FIRST, before any other imports

import dotenv from 'dotenv';
dotenv.config();

// Now import other modules that may use environment variables
import express from 'express';
// Forced restart to load new .env: 2026-01-19T13:46:00
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Route Imports
import antigravityRoutes from './routes/antigravity.js';
import geminiRoutes from './routes/gemini.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import agentRoutes from './routes/agents.js';

// Security Middleware
import { apiLimiter, strictLimiter } from './middleware/rateLimiter.js';
import { authenticateToken } from './middleware/auth.js';
// import { validate, schemas } from './middleware/validation.js'; // Commented out if not used yet

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (required for rate limiting behind proxies like Railway/Vercel)
app.set('trust proxy', 1);

// ========================================
// MIDDLEWARE
// ========================================

// 1. CORS Configuration (MUST BE FIRST)
const corsOptions = {
  origin: function (origin, callback) {
    const normalizedOrigin = origin ? origin.toLowerCase().replace(/\/$/, '') : null;
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://commcoach-ai.vercel.app'
    ];
    const envOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim().toLowerCase().replace(/\/$/, '')).filter(Boolean);
    const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

    if (!origin || allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Rejected: ${origin}`);
      callback(null, false);
    }

  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 2. Rate Limiter (Security)
app.use('/api', apiLimiter);


// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ========================================
// HEADLTH & API ROUTES
// ========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount Routes
app.use('/api/antigravity', strictLimiter, antigravityRoutes);
app.use('/api/gemini', strictLimiter, geminiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agents', strictLimiter, agentRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'CommCoach AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      admin: '/api/admin',
      agents: '/api/agents',
      antigravity: '/api/antigravity',
      gemini: '/api/gemini'
    }
  });
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    availableRoutes: ['/health', '/api', '/api/auth/*', '/api/admin/*', '/api/antigravity/*', '/api/gemini/*']
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// START SERVER
// ========================================

const server = app.listen(PORT, () => {
  console.log('\n🚀 CommCoach Backend Server');
  console.log('================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Auth Routes: http://localhost:${PORT}/api/auth`);
  console.log('================================\n');
});

process.on('SIGTERM', () => {
  server.close(() => console.log('HTTP server closed'));
});
