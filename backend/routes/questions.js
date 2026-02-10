const express = require('express');
const router = express.Router();
const path = require('path');

// Load questions from local JSON data
const questions = require('../data/questions.json');

// GET /questions - list all questions
router.get('/', (req, res) => {
  res.json(questions);
});

// GET /questions/:id - single question
router.get('/:id', (req, res) => {
  const q = questions.find((item) => item.id === req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  res.json(q);
});

module.exports = router;
