const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const questionsRoutes = require('./routes/questions');
const submissionRoutes = require("./routes/submissions")

require("dotenv").config();

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/question', questionsRoutes);
app.use('/submission', submissionRoutes);

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