const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authentication middleware that reads JWT from cookies
const authMiddleware = async (req, res, next) => {
  console.log('🛡️ Auth middleware checking...');
  
  try {
    // Get token from cookies (not Authorization header)
    const token = req.cookies.authToken;
    console.log('Token from cookie:', token ? 'EXISTS' : 'MISSING');
    
    if (!token) {
      console.log('❌ No token found - access denied');
      return res.status(401).json({ error: 'Access denied - please login' });
    }

    // Verify JWT token
    console.log('🔍 Verifying token...');
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    console.log('✅ Token verified for user:', decoded.email);

    // Get full user data from database (optional but useful)
    const user = await User.findByEmail(decoded.email);
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user info to request object for use in route handlers
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    console.log('✅ Auth middleware passed - user authenticated');
    next(); // Continue to the route handler
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token - please login again' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired - please login again' });
    }
    
    return res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = authMiddleware;
