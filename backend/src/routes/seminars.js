import express from 'express';
import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { uploadImage } from '../lib/cloudinary.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Create seminar
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description = '', date, style, level, venue = '', imageUrl = '' } = req.body;
    if (!title || !date || !style || !level || !venue) return res.status(400).json({ message: 'Missing fields' });
    const seminar = await Seminar.create({ title, description, date, style, level, venue, imageUrl, createdBy: req.userId });
    res.status(201).json({ seminar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image for seminar and create
router.post('/with-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description = '', date, style, level, venue = '' } = req.body;
    if (!title || !date || !style || !level || !venue) return res.status(400).json({ message: 'Missing fields' });
    let imageUrl = '';
    if (req.file) {
      const hasCloudinary = Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      );
      if (!hasCloudinary) {
        const filename = `${req.userId}-${Date.now()}${path.extname(req.file.originalname)}`;
        fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
        imageUrl = `/uploads/${filename}`;
      } else {
        const result = await uploadImage(req.file.buffer, 'growix/seminars');
        imageUrl = result.secure_url;
      }
    }
    const seminar = await Seminar.create({ title, description, date, style, level, venue, imageUrl, createdBy: req.userId });
    res.status(201).json({ seminar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List and filter seminars
router.get('/', async (req, res) => {
  const { date, style, level, q, limit = 20, offset = 0 } = req.query;
  const filter = {};
  if (date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }
  }
  if (style) filter.style = style;
  if (level) filter.level = level;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { venue: { $regex: q, $options: 'i' } }
    ];
  }
  const seminars = await Seminar.find(filter).sort({ date: 1 }).populate('createdBy', 'username photoUrl').limit(parseInt(limit)).skip(parseInt(offset));
  const total = await Seminar.countDocuments(filter);
  res.json({ seminars, total, hasMore: seminars.length === parseInt(limit) });
});

// Get one
router.get('/:id', async (req, res) => {
  const seminar = await Seminar.findById(req.params.id).populate('createdBy', 'username photoUrl');
  if (!seminar) return res.status(404).json({ message: 'Not found' });
  // count how many users saved this seminar
  const savedCount = await User.countDocuments({ savedSeminars: req.params.id });
  res.json({ seminar, savedCount });
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar) return res.status(404).json({ message: 'Not found' });
  if (seminar.createdBy.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, date, style, level, venue, imageUrl } = req.body;
  if (title !== undefined) seminar.title = title;
  if (description !== undefined) seminar.description = description;
  if (date !== undefined) seminar.date = date;
  if (style !== undefined) seminar.style = style;
  if (level !== undefined) seminar.level = level;
  if (venue !== undefined) seminar.venue = venue;
  if (imageUrl !== undefined) seminar.imageUrl = imageUrl;
  await seminar.save();
  res.json({ seminar });
});

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar) return res.status(404).json({ message: 'Not found' });
  if (seminar.createdBy.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
  await seminar.deleteOne();
  res.json({ ok: true });
});

// Like / Unlike
router.post('/:id/like', requireAuth, async (req, res) => {
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar) return res.status(404).json({ message: 'Not found' });
  const has = seminar.likes.some((id) => id.toString() === req.userId);
  if (has) seminar.likes = seminar.likes.filter((id) => id.toString() !== req.userId);
  else seminar.likes.push(req.userId);
  await seminar.save();
  res.json({ likes: seminar.likes.length, liked: !has });
});

// Save / Unsave to user
router.post('/:id/save', requireAuth, async (req, res) => {
  try {
    const seminarId = req.params.id;
    const userId = req.userId;
    
    // Check if seminar exists
    const seminar = await Seminar.findById(seminarId);
    if (!seminar) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    
    // Check if user has already saved this seminar
    const user = await User.findById(userId);
    const hasSaved = user.savedSeminars.some((id) => id.toString() === seminarId);
    
    // Use atomic operations to update both collections
    if (hasSaved) {
      // Remove from saved seminars
      await User.findByIdAndUpdate(userId, { $pull: { savedSeminars: seminarId } });
      await Seminar.findByIdAndUpdate(seminarId, { $pull: { savedBy: userId } });
    } else {
      // Add to saved seminars
      await User.findByIdAndUpdate(userId, { $addToSet: { savedSeminars: seminarId } });
      await Seminar.findByIdAndUpdate(seminarId, { $addToSet: { savedBy: userId } });
    }
    
    // Get updated saved count
    const updatedSeminar = await Seminar.findById(seminarId);
    const savedCount = updatedSeminar.savedBy ? updatedSeminar.savedBy.length : 0;
    
    res.json({ 
      saved: !hasSaved, 
      savedCount,
      message: hasSaved ? 'Removed from saved workshops' : 'Added to saved workshops'
    });
  } catch (err) {
    console.error('Save seminar error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


