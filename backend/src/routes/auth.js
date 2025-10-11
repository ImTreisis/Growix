import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Input validation and sanitization functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // At least 8 characters, 1 number, 1 symbol
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return {
    isValid: minLength && hasNumber && hasSymbol,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      hasNumber: !hasNumber ? 'Password must contain at least 1 number' : null,
      hasSymbol: !hasSymbol ? 'Password must contain at least 1 symbol' : null
    }
  };
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

router.post('/register', async (req, res) => {
  try {
    let { email, username, password, firstName = '', lastName = '' } = req.body;
    
    // Sanitize inputs
    email = sanitizeInput(email?.toLowerCase());
    username = sanitizeInput(username);
    password = sanitizeInput(password);
    firstName = sanitizeInput(firstName);
    lastName = sanitizeInput(lastName);
    
    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }
    
    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }
    
    // Validate username (5-20 characters, alphanumeric and underscores only)
    if (username.length < 5 || username.length > 20) {
      return res.status(400).json({ message: 'Username must be 5-20 characters long' });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
    }
    
    // Check if email already exists (unique per account)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Check if username already exists (unique per account)
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    
    const passwordHash = await bcrypt.hash(password, 12); // Increased salt rounds
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
    let { emailOrUsername, password } = req.body;
    
    // Sanitize inputs
    emailOrUsername = sanitizeInput(emailOrUsername);
    password = sanitizeInput(password);
    
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }
    
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


