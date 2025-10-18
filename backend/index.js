import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import seminarRoutes from './src/routes/seminars.js';

dotenv.config();

const app = express();

const ALLOW_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({ 
  origin: (origin, cb) => {
    // Allow requests with no origin 
    if (!origin) return cb(null, true);
    // Check if origin is in allowed list
    if (ALLOW_ORIGINS.includes(origin)) return cb(null, true);
    // In development, allow localhost
    return cb(null, true);
  }, 
  credentials: true 
}));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

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
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 20 save/unsave operations per minute
  message: { message: 'Too many save operations, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

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


