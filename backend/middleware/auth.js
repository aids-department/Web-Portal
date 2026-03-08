const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_change_this_in_env';

// ============================================
// verifyToken
// Decodes the Bearer token and attaches req.user
// Use on any route that requires a logged-in user
// ============================================
const verifyToken = (req, res, next) => {
  // Token comes in the Authorization header as: "Bearer <token>"
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // extract the token part

  try {
    // jwt.verify throws if the token is expired or tampered with
    const decoded = jwt.verify(token, JWT_SECRET);

    // decoded will be: { id, username, role, iat, exp }
    req.user = decoded;

    next(); // pass control to the actual route handler
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// ============================================
// verifyAdmin
// Use AFTER verifyToken on admin-only routes
// ============================================
const verifyAdmin = (req, res, next) => {
  // verifyToken must run first — req.user is set by that
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  next();
};

// ============================================
// generateToken  (used in login route)
// ============================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id:       user._id.toString(),
      username: user.username,
      role:     user.role || 'user',   // default role is 'user'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { verifyToken, verifyAdmin, generateToken };