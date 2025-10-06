import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../lib/cloudinary.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.memoryStorage();
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
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // fallback to local if cloud not configured
    const filename = `${req.userId}-${Date.now()}${path.extname(req.file.originalname)}`;
    fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
    const user = await User.findByIdAndUpdate(req.userId, { photoUrl: `/uploads/${filename}` }, { new: true }).select('-passwordHash');
    return res.json({ user });
  }
  const result = await uploadImage(req.file.buffer, 'growix/profile');
  const user = await User.findByIdAndUpdate(req.userId, { photoUrl: result.secure_url }, { new: true }).select('-passwordHash');
  res.json({ user });
});

export default router;


