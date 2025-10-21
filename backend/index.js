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

dotenv.config();

const app = express();

// Trust proxy for rate limiting to work correctly behind reverse proxies (like Render)
app.set('trust proxy', 1);

const ALLOW_ORIGINS = (process.env.CORS_ORIGINS || 'https://growix-ten.vercel.app/').split(',');
app.use(cors({ 
  origin: (origin, cb) => {
    // Allow requests with no origin (for mobile apps, etc.)
    if (!origin) return cb(null, true);
    // Check if origin is in allowed list
    if (ALLOW_ORIGINS.includes(origin)) return cb(null, true);
    // Reject all other origins
    return cb(new Error('Not allowed by CORS'));
  }, 
  credentials: true 
}));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Session configuration (after body parsers)
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom cookie name
  cookie: {
    httpOnly: true, // Prevents XSS attacks (can't access via JavaScript)
    secure: true, // HTTPS only (always true for production)
    sameSite: 'strict', // CSRF protection (strict for production)
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

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Global error handlers
process.on('unhandledRejection', err => {
  console.error('Unhandled promise rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});


