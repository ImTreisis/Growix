export function requireAuth(req, res, next) {
  console.log('🔐 Auth check - Session ID:', req.sessionID, 'User ID:', req.session?.userId, 'Cookie:', req.headers.cookie);
  
  // Check if user is logged in via session
  if (!req.session || !req.session.userId) {
    console.log('❌ No session or userId found');
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Set userId from session
  req.userId = req.session.userId;
  console.log('✅ Auth successful for user:', req.userId);
  next();
}
