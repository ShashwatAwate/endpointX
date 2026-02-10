const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Signup (register)
router.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'email and password required' });

		const existing = await User.findByEmail(email);
		if (existing) return res.status(409).json({ error: 'User already exists' });

		const created = await User.create(name || '', email, password);
		res.status(201).json({ message: 'User registered successfully', user: { id: created.id, name: created.name, email: created.email } });
	} catch (error) {
		res.status(500).json({ error: 'Registration failed' });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'email and password required' });

		const user = await User.findByEmail(email);
		if (!user) return res.status(401).json({ error: 'Authentication failed' });

		const passwordMatch = await User.comparePassword(password, user.password);
		if (!passwordMatch) return res.status(401).json({ error: 'Authentication failed' });

		const secret = process.env.JWT_SECRET || 'your-secret-key';
		const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: 'Login failed' });
	}
});

module.exports = router;
