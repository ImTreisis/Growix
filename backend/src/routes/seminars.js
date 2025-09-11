import express from 'express';
import Seminar from '../models/Seminar.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create seminar
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description = '', date, style, level } = req.body;
    if (!title || !date || !style || !level) return res.status(400).json({ message: 'Missing fields' });
    const seminar = await Seminar.create({ title, description, date, style, level, createdBy: req.userId });
    res.status(201).json({ seminar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List and filter seminars
router.get('/', async (req, res) => {
  const { date, style, level, q } = req.query;
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
  if (q) filter.title = { $regex: q, $options: 'i' };
  const seminars = await Seminar.find(filter).sort({ date: 1 }).populate('createdBy', 'username photoUrl');
  res.json({ seminars });
});

// Get one
router.get('/:id', async (req, res) => {
  const seminar = await Seminar.findById(req.params.id).populate('createdBy', 'username photoUrl');
  if (!seminar) return res.status(404).json({ message: 'Not found' });
  res.json({ seminar });
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  const seminar = await Seminar.findById(req.params.id);
  if (!seminar) return res.status(404).json({ message: 'Not found' });
  if (seminar.createdBy.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, date, style, level } = req.body;
  if (title !== undefined) seminar.title = title;
  if (description !== undefined) seminar.description = description;
  if (date !== undefined) seminar.date = date;
  if (style !== undefined) seminar.style = style;
  if (level !== undefined) seminar.level = level;
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
  res.json({ saved: !has, savedSeminars: user.savedSeminars });
});

export default router;


