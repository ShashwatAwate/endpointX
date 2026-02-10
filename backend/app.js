const express = require('express');
const app = express();

const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
const questionsRoutes = require('./routes/questions');
const submissionRoutes = require("./routes/submissions")

require("dotenv").config();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/protected', protectedRoute);
app.use('/question', questionsRoutes);
app.use('/submission', submissionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
