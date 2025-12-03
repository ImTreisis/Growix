import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { requireAuth } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../lib/email.js';

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
    
    // Create session and save it explicitly
    req.session.userId = user._id.toString();
    
    // Save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session error' });
      }
      console.log('✅ Session created for user:', user._id.toString(), 'Session ID:', req.sessionID);
      res.status(201).json({ user: sanitizeUser(user) });
    });
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
    
    // Regenerate session to prevent session fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.status(500).json({ message: 'Session error' });
      }
      
      // Create session
      req.session.userId = user._id.toString();
      
      // Save session before sending response
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).json({ message: 'Session error' });
        }
        console.log('✅ Session created for login:', user._id.toString(), 'Session ID:', req.sessionID);
        res.json({ user: sanitizeUser(user) });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/request-password-reset', async (req, res) => {
  try {
    let { email } = req.body;
    email = sanitizeInput(email?.toLowerCase());

    if (!email || !validateEmail(email)) {
      return res.status(200).json({ message: 'If your email is in our system, you will receive a reset link shortly' });
    }

    const user = await User.findOne({ email });
    if (user) {
      // Remove older tokens for this user
      await PasswordResetToken.deleteMany({ user: user._id });

      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await PasswordResetToken.create({ user: user._id, tokenHash, expiresAt });

      try {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.firstName || user.username,
          token
        });
      } catch (emailErr) {
        console.error('❌ Failed to send password reset email:', emailErr);
      }
    }

    res.json({ message: 'If your email is in our system, you will receive a reset link shortly' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    let { token, password } = req.body;
    token = sanitizeInput(token);
    password = sanitizeInput(password);

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: null
    });

    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    const user = await User.findById(resetRecord.user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset link' });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();

    resetRecord.usedAt = new Date();
    await resetRecord.save();

    res.json({ message: 'Password updated — you can log in now' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  res.json({ user });
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('sessionId'); // Clear session cookie (matches session name)
    res.json({ message: 'Logged out successfully' });
  });
});

function sanitizeUser(user) {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
}

export default router;


