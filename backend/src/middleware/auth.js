import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  // Try cookie first, then fallback to header for backward compatibility
  const token = req.cookies.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
}


