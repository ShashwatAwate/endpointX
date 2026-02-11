const express = require('express');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const cors = require("cors");

const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const questionsRoutes = require('./routes/questions');
const submissionRoutes = require("./routes/submissions")

require("dotenv").config();

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// 🔓 UNPROTECTED ROUTES (no login required)
app.use('/auth', authRoutes); // login, signup, logout

// 🛡️ PROTECTED ROUTES (login required) 
app.use('/protected', authMiddleware, protectedRoute);
app.use('/questions', authMiddleware, questionsRoutes); // Fixed typo: question -> questions
app.use('/submissions', authMiddleware, submissionRoutes); // Fixed typo: submission -> submissions

// 🧪 TEST PROTECTED ROUTE - shows how middleware works
app.get('/test-protected', authMiddleware, (req, res) => {
  // req.user is available because authMiddleware added it
  res.json({
    message: 'This is a protected route!',
    currentUser: req.user, // Contains { id, email, name }
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const pool = require('./db');

pool.connect()
  .then(client => {
    console.log('PostgreSQL connected!');
    client.release();
  })
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));
