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

// File upload protection for profile photos
const upload = multer({ 
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB max for profile photos
    files: 1 // Only 1 file per request
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn('⚠️ Blocked profile photo upload:', file.mimetype);
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash').populate('savedSeminars');
  res.json({ user });
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash -savedSeminars');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.put('/me', requireAuth, async (req, res) => {
  const { 
    firstName = '', 
    lastName = '', 
    bio = '', 
    username,
    instagram = '',
    tiktok = '',
    linkedin = '',
    facebook = ''
  } = req.body;
  const update = { firstName, lastName, bio, instagram, tiktok, linkedin, facebook };
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


