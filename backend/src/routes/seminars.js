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

// File upload protection
const upload = multer({ 
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB max file size
    files: 1 // Only 1 file per request
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn('⚠️ Blocked file upload:', file.mimetype);
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
    }
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Create seminar
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description = '', date, localDateTime, type = 'workshop', style, level, venue = '', price = '', imageUrl = '', timeZone, endDate, endLocalDateTime } = req.body;
    const trimmedLocalDateTime = typeof localDateTime === 'string' ? localDateTime.trim() : '';
    const trimmedEndLocalDateTime = typeof endLocalDateTime === 'string' ? endLocalDateTime.trim() : '';
    
    // Validation based on type
    if (!title || !date || !venue || !trimmedLocalDateTime) return res.status(400).json({ message: 'Missing required fields' });
    
    if (type === 'workshop') {
      if (!style || !level) return res.status(400).json({ message: 'Style and level are required for workshops' });
    } else if (type === 'event') {
      if (!endDate || !trimmedEndLocalDateTime) return res.status(400).json({ message: 'End date is required for events' });
    }
    
    // Validate date is not in the past
    const seminarDate = new Date(date);
    const now = new Date();
    if (seminarDate < now) {
      return res.status(400).json({ message: 'Cannot create a seminar in the past. Please select a future date and time.' });
    }
    
    // Validate endDate is after start date for events
    if (endDate) {
      const end = new Date(endDate);
      if (end < seminarDate) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }
    
    const seminarTimeZone = typeof timeZone === 'string' && timeZone.trim() ? timeZone : 'UTC';
    
    const seminarData = { 
      title, 
      description, 
      date, 
      localDateTime: trimmedLocalDateTime, 
      type,
      venue, 
      imageUrl, 
      timeZone: seminarTimeZone, 
      createdBy: req.userId 
    };
    
    if (type === 'workshop') {
      seminarData.style = style;
      seminarData.level = level;
    } else if (type === 'event') {
      seminarData.endDate = endDate;
      seminarData.endLocalDateTime = trimmedEndLocalDateTime;
    }
    
    const seminar = await Seminar.create(seminarData);
    
    // Populate createdBy field for consistent response
    await seminar.populate('createdBy', 'username photoUrl');
    
    res.status(201).json({ seminar });
  } catch (err) {
    console.error('❌ Error creating seminar:', err);
    // Better error message for debugging
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Upload image for seminar and create
router.post('/with-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description = '', date, localDateTime, type = 'workshop', style, level, venue = '', price = '', timeZone, endDate, endLocalDateTime } = req.body;
    const trimmedLocalDateTime = typeof localDateTime === 'string' ? localDateTime.trim() : '';
    const trimmedEndLocalDateTime = typeof endLocalDateTime === 'string' ? endLocalDateTime.trim() : '';
    
    // Validation based on type
    if (!title || !date || !venue || !trimmedLocalDateTime) return res.status(400).json({ message: 'Missing required fields' });
    
    if (type === 'workshop') {
      if (!style || !level) return res.status(400).json({ message: 'Style and level are required for workshops' });
    } else if (type === 'event') {
      if (!endDate || !trimmedEndLocalDateTime) return res.status(400).json({ message: 'End date is required for events' });
    }
    
    // Validate date is not in the past
    const seminarDate = new Date(date);
    const now = new Date();
    if (seminarDate < now) {
      return res.status(400).json({ message: 'Cannot create a seminar in the past. Please select a future date and time.' });
    }
    
    // Validate endDate is after start date for events
    if (endDate) {
      const end = new Date(endDate);
      if (end < seminarDate) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }
    
    // Upload image FIRST (before creating seminar in DB)
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
        // Upload to Cloudinary - if this fails, the seminar won't be created
        const result = await uploadImage(req.file.buffer, 'growix/seminars');
        imageUrl = result.secure_url;
      }
    }
    const seminarTimeZone = typeof timeZone === 'string' && timeZone.trim() ? timeZone : 'UTC';
    
    const seminarData = { 
      title, 
      description, 
      date, 
      localDateTime: trimmedLocalDateTime, 
      type,
      venue,
      price: price || '',
      imageUrl, 
      timeZone: seminarTimeZone, 
      createdBy: req.userId 
    };
    
    if (type === 'workshop') {
      seminarData.style = style;
      seminarData.level = level;
    } else if (type === 'event') {
      seminarData.endDate = endDate;
      seminarData.endLocalDateTime = trimmedEndLocalDateTime;
    }
    
    // Only create seminar AFTER image upload succeeds
    const seminar = await Seminar.create(seminarData);
    
    // Populate createdBy field for consistent response
    await seminar.populate('createdBy', 'username photoUrl');
    
    res.status(201).json({ seminar });
  } catch (err) {
    console.error('❌ Error creating seminar:', err);
    // Better error message for debugging
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List and filter seminars
router.get('/', async (req, res) => {
  const { date, style, level, q, type, limit = 20, offset = 0 } = req.query;
  const filter = {};
  
  // Always filter out past seminars (only show future seminars)
  filter.date = { $gte: new Date() };
  
  if (date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }
  }
  if (type) filter.type = type;
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
  
  const { title, description, date, localDateTime, type, style, level, venue, price, imageUrl, timeZone, endDate, endLocalDateTime } = req.body;
  
  // Validate date is not in the past if updating date
  if (date !== undefined) {
    const seminarDate = new Date(date);
    const now = new Date();
    if (seminarDate < now) {
      return res.status(400).json({ message: 'Cannot update seminar to a past date. Please select a future date and time.' });
    }
    seminar.date = date;
  }
  if (localDateTime !== undefined) {
    const trimmedLocalDateTime = typeof localDateTime === 'string' ? localDateTime.trim() : '';
    if (trimmedLocalDateTime) {
      seminar.localDateTime = trimmedLocalDateTime;
    }
  }
  
  if (title !== undefined) seminar.title = title;
  if (description !== undefined) seminar.description = description;
  if (type !== undefined) seminar.type = type;
  if (style !== undefined) seminar.style = style;
  if (level !== undefined) seminar.level = level;
  if (venue !== undefined) seminar.venue = venue;
  if (price !== undefined) seminar.price = price || '';
  if (imageUrl !== undefined) seminar.imageUrl = imageUrl;
  if (timeZone !== undefined) {
    seminar.timeZone = typeof timeZone === 'string' && timeZone.trim() ? timeZone : seminar.timeZone;
  }
  if (endDate !== undefined) {
    if (endDate && seminar.date && new Date(endDate) < new Date(seminar.date)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    seminar.endDate = endDate || null;
  }
  if (endLocalDateTime !== undefined) {
    const trimmedEndLocalDateTime = typeof endLocalDateTime === 'string' ? endLocalDateTime.trim() : '';
    seminar.endLocalDateTime = trimmedEndLocalDateTime || '';
  }
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
  const seminarId = req.params.id;
  const user = await User.findById(req.userId);
  const has = user.savedSeminars.some((id) => id.toString() === seminarId);
  if (has) user.savedSeminars = user.savedSeminars.filter((id) => id.toString() !== seminarId);
  else user.savedSeminars.push(seminarId);
  await user.save();
  
  // Count how many users saved this seminar
  const savedCount = await User.countDocuments({ savedSeminars: seminarId });
  
  res.json({ 
    saved: !has, 
    savedSeminars: user.savedSeminars,
    savedCount,
    message: !has ? 'Added to saved workshops' : 'Removed from saved workshops'
  });
});

export default router;


