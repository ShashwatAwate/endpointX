const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Simple test route - just echo back the input
router.post('/test', (req, res) => {
  console.log('Test route hit!');
  console.log('Received:', req.body);

  res.json({
    message: 'Test route working!',
    received: req.body
  });
});

// Database signup route with debugging
router.post('/signup', async (req, res) => {
  console.log('=== SIGNUP WITH DATABASE ===');
  console.log('Request body:', req.body);

  try {
    const { name, email, password } = req.body;
    console.log('Extracted fields:');
    console.log('- name:', name, typeof name);
    console.log('- email:', email, typeof email);
    console.log('- password:', password ? '[HIDDEN]' : 'undefined', typeof password);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'email and password required' });
    }

    console.log('✅ Generating UUID...');
    const id = uuidv4();
    console.log('Generated UUID:', id, typeof id);

    console.log('✅ Calling User.create...');
    const created = await User.create(id, name || '', email, password);
    console.log('✅ User created successfully:', created);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: created.id, name: created.name, email: created.email }
    });
  } catch (error) {
    console.error('❌ SIGNUP ERROR:');
    console.error('- Error message:', error.message);
    console.error('- Full error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  console.log('=== LOGIN WITH DATABASE ===');
  console.log('Request body:', req.body);

  try {
    const { email, password } = req.body;
    console.log('Extracted fields:');
    console.log('- email:', email, typeof email);
    console.log('- password:', password ? '[HIDDEN]' : 'undefined', typeof password);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'email and password required' });
    }

    console.log('✅ Looking up user by email...');
    const user = await User.findByEmail(email);
    console.log('User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Authentication failed' });
    }

    console.log('✅ Comparing passwords...');
    const passwordMatch = await User.comparePassword(password, user.password);
    console.log('Password match:', passwordMatch ? 'YES' : 'NO');

    if (!passwordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Authentication failed' });
    }

    console.log('✅ Generating JWT token...');
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
    console.log('✅ Token generated successfully');

    // Set token as cookie
    res.cookie('authToken', token, {
      httpOnly: true, // Prevents XSS attacks
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax', // CSRF protection
      maxAge: 3600000 * 5 // 1 hour in milliseconds
    });

    console.log('✅ Cookie set successfully');

    res.status(200).json({
      message: 'Login successful',
      token, // Still include in response for debugging
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:');
    console.error('- Error message:', error.message);
    console.error('- Full error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user from cookie
router.get('/user', async (req, res) => {
  console.log('=== GET CURRENT USER ===');

  try {
    // Get token from cookies
    const token = req.cookies.authToken;
    console.log('Token from cookie:', token ? 'EXISTS' : 'MISSING');

    if (!token) {
      console.log('❌ No token found in cookies');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify JWT token
    console.log('✅ Verifying token...');
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', { userId: decoded.userId, email: decoded.email });

    // Get user from database
    console.log('✅ Looking up user in database...');
    const user = await User.findByEmail(decoded.email);
    console.log('User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };

    console.log('✅ Returning user data');
    res.status(200).json({ user: userData });

  } catch (error) {
    console.error('❌ GET USER ERROR:');
    console.error('- Error message:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Logout route - clear the auth cookie
router.post('/logout', (req, res) => {
  // Simply clear the authToken cookie
  res.clearCookie('authToken');

  res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;
