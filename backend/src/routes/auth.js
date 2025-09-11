import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, username, password, firstName = '', lastName = '' } = req.body;
    if (!email || !username || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, passwordHash, firstName, lastName });
    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user._id.toString());
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  res.json({ user });
});

function sanitizeUser(user) {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
}

export default router;


