import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import seminarRoutes from './src/routes/seminars.js';
import registrationRoutes from './src/routes/registrations.js';
import { handleStripeWebhook } from './src/lib/stripeWebhook.js';

dotenv.config();

const app = express();

// Trust proxy for rate limiting to work correctly behind reverse proxies (like Render)
app.set('trust proxy', 1);

// Stripe webhook MUST use raw body - add before json parser
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Parse and normalize allowed origins (remove trailing slashes)
const ALLOW_ORIGINS = (process.env.CORS_ORIGINS || 'https://growix-ten.vercel.app')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, '')); // Remove trailing slashes

console.log('✅ Allowed CORS origins:', ALLOW_ORIGINS);

app.use(cors({ 
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return cb(null, true);
    
    // Normalize incoming origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is allowed
    if (ALLOW_ORIGINS.includes(normalizedOrigin)) {
      console.log('✅ CORS allowed:', origin);
      return cb(null, true);
    }
    
    // Reject and log
    console.log('❌ CORS blocked:', origin);
    return cb(null, false); // Reject silently (don't throw error)
  }, 
  credentials: true 
}));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL Injection Protection - Sanitize user input
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach(key => {
        // Remove keys that start with $ (MongoDB operators)
        if (key.startsWith('$')) {
          console.warn('⚠️ Blocked NoSQL injection attempt:', key);
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      });
    }
    return obj;
  };
  
  // Only sanitize req.body (query and params are read-only)
  if (req.body && typeof req.body === 'object') {
    sanitize(req.body);
  }
  next();
});

app.use(morgan('dev'));

// Session configuration (after body parsers)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom cookie name
  cookie: {
    httpOnly: true, // Prevents XSS attacks (can't access via JavaScript)
    secure: true, // HTTPS only (always true for production)
    sameSite: 'lax', // Required for cross-domain cookies (Vercel → Render)
    path: '/', // Ensure cookie is sent with all paths
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  proxy: true // Trust the reverse proxy (Render/Vercel)
}));

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 * 0, // 15 minutes
  max: 500, // 5 attempts per window
  message: { message: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for save/unsave operations
const saveLimiter = rateLimit({
  windowMs: 2000, // 2 seconds
  max: 2, // max 2 save requests per 2 seconds
  message: { message: 'Too many save attempts, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);

// Apply save limiter to seminars save routes before the main seminars routes
app.use('/api/seminars/:id/save', saveLimiter);
app.use('/api/seminars', seminarRoutes);
app.use('/api/registrations', registrationRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
// 500
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/growix';
const PORT = process.env.PORT || 4000;

// Start server immediately (don't wait for MongoDB)
// Bind to 0.0.0.0 for Render (required for cloud deployment)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API listening on port ${PORT}`);
});

// Connect to MongoDB with timeout
const connectWithTimeout = async () => {
  const timeout = setTimeout(() => {
    console.error('⏱️ MongoDB connection timeout after 10 seconds');
    console.log('⚠️ Server running without MongoDB - some features may not work');
  }, 10000);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    clearTimeout(timeout);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    clearTimeout(timeout);
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.log('⚠️ Server running without MongoDB - some features may not work');
  }
};

connectWithTimeout();

// Automatic cleanup of past seminars
const cleanupPastSeminars = async () => {
  try {
    const now = new Date();
    const result = await mongoose.model('Seminar').deleteMany({ date: { $lt: now } });
    if (result.deletedCount > 0) {
      console.log(`🗑️ Cleaned up ${result.deletedCount} past seminar(s)`);
    }
  } catch (err) {
    console.error('❌ Error cleaning up past seminars:', err.message);
  }
};

// Run cleanup every 24 hours (daily)
setInterval(cleanupPastSeminars, 24 * 60 * 60 * 1000);

// Global error handlers
process.on('unhandledRejection', err => {
  console.error('Unhandled promise rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});


