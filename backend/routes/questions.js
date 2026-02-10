const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db'); // Add database connection

// Load questions from local JSON data (fallback)
const questions = require('../data/questions.json');
// const { getQuestionById, submitQuestion } = require('../handlers/questions'); // COMMENTED OUT OLD HANDLER
const { submitQuestion } = require('../handlers/questions'); // Only need submitQuestion now

// GET /questions - list all questions from database
router.get('/', async (req, res) => {
  console.log('=== GET ALL QUESTIONS ===');
  console.log('Authenticated user:', req.user.email); // Available from authMiddleware
  
  try {
    console.log('✅ Fetching questions from database...');
    
    // Query database for all questions (only title and description)
    const result = await pool.query(
      'SELECT id, title, description FROM questions ORDER BY created_at DESC'
    );
    
    console.log(`✅ Found ${result.rows.length} questions`);
    
    // Return the questions
    res.json({
      questions: result.rows,
      count: result.rows.length,
      user: req.user.email // Show which user made the request
    });
    
  } catch (error) {
    console.error('❌ GET QUESTIONS ERROR:');
    console.error('- Error message:', error.message);
    console.error('- Full error:', error);
    
    // Fallback to local JSON data if database fails
    console.log('⚠️ Falling back to local JSON data...');
    
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description
    }));
    
    res.json({
      questions: formattedQuestions,
      count: formattedQuestions.length,
      source: 'fallback-json',
      user: req.user.email
    });
  }
});

// POST /questions/get - fetch specific question by ID from JSON body
router.post('/get', async (req, res) => {
  console.log('=== GET SPECIFIC QUESTION ===');
  console.log('Authenticated user:', req.user.email);
  console.log('Request body:', req.body);
  
  try {
    const { questionId } = req.body;
    console.log('Question ID requested:', questionId);
    
    if (!questionId) {
      console.log('❌ Missing questionId in request body');
      return res.status(400).json({ error: 'questionId is required' });
    }

    console.log('✅ Fetching question from database...');
    
    // Query database for specific question (all fields)
    const result = await pool.query(
      'SELECT * FROM questions WHERE id = $1',
      [questionId]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Question not found');
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const question = result.rows[0];
    console.log('✅ Found question:', question.title);
    
    // Return the complete question
    res.json({
      question: question,
      user: req.user.email
    });
    
  } catch (error) {
    console.error('❌ GET SPECIFIC QUESTION ERROR:');
    console.error('- Error message:', error.message);
    console.error('- Full error:', error);
    
    // Fallback to local JSON data if database fails
    console.log('⚠️ Falling back to local JSON data...');
    
    const { questionId } = req.body;
    const fallbackQuestion = questions.find(q => q.id === questionId);
    
    if (!fallbackQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({
      question: fallbackQuestion,
      source: 'fallback-json',
      user: req.user.email
    });
  }
});

// POST /questions/my-submissions - get all submissions for current user
router.post('/my-submissions', async (req, res) => {
  console.log('=== GET MY SUBMISSIONS ===');
  console.log('Authenticated user:', req.user.email);
  
  try {
    const userId = req.user.id;
    console.log('✅ Fetching submissions for user:', userId);
    
    // Query database for user's submissions with question details
    const result = await pool.query(`
      SELECT 
        a.id as submission_id,
        a.question_id,
        a.code_files,
        a.language,
        a.framework,
        a.status,
        a.score,
        a.test_results,
        a.submitted_at,
        q.title as question_title,
        q.description as question_description,
        q.difficulty
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.user_id = $1
      ORDER BY a.submitted_at DESC
    `, [userId]);
    
    console.log(`✅ Found ${result.rows.length} submissions`);
    
    // Return the submissions
    res.json({
      submissions: result.rows,
      count: result.rows.length,
      user: req.user.email
    });
    
  } catch (error) {
    console.error('❌ GET MY SUBMISSIONS ERROR:');
    console.error('- Error message:', error.message);
    console.error('- Full error:', error);
    
    res.status(500).json({ 
      error: 'Failed to fetch submissions',
      details: error.message 
    });
  }
});

// COMMENTED OUT OLD GET ROUTE - using POST /questions/get instead
// router.get("/:id", getQuestionById)

// POST /questions/:id - submit answer for verification  
router.post("/:id", submitQuestion)

module.exports = router;
