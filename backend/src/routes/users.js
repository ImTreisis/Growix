import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash').populate('savedSeminars');
  res.json({ user });
});

router.put('/me', requireAuth, async (req, res) => {
  const { firstName = '', lastName = '', bio = '', username } = req.body;
  const update = { firstName, lastName, bio };
  if (username) update.username = username;
  const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-passwordHash');
  res.json({ user });
});

router.post('/me/photo', requireAuth, upload.single('photo'), async (req, res) => {
  const photoUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.userId, { photoUrl }, { new: true }).select('-passwordHash');
  res.json({ user });
});

export default router;


