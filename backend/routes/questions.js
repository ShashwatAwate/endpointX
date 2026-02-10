const express = require('express');
const router = express.Router();
const path = require('path');

// Load questions from local JSON data
const questions = require('../data/questions.json');
const { getQuestionById, submitQuestion } = require('../handlers/questions');

// GET /questions - list all questions
router.get('/', (req, res) => {
  res.json(questions);
});

// GET /questions/:id - single question
router.get("/:id", getQuestionById)
router.post("/:id", submitQuestion)

module.exports = router;
