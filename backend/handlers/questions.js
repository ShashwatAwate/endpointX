const { getById } = require("../models/queFetch");
const { publishToVerificationQueue } = require("../queue/rabbitmq");

// COMMENTED OUT OLD HANDLER - using POST /questions/get route instead
/*
const getQuestionById = (req, res) => {
  const q = questions.find((item) => item.id === req.params.id);

  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(q);
};
*/

/*
UserID             string `json:"user_id"`
QuestionID         string `json:"question_id"`
IsProblemGenerated int    `json:"is_problem_generated"`
Language           string `json:"language"`
Runtime            string `json:"runtime"`
Framework          string `json:"framework"`
TestFramework      string `json:"test_framework"`
HTTPClient         string `json:"http_client"`
Entry              string `json:"entry"`
AppFiles           []File `json:"app_files"`
TestFiles          []File `json:"test_files"`
*/

const submitQuestion = async (req, res) => {
  const { id } = req.params;

  console.log('=== SUBMIT QUESTION ===');
  console.log('Question ID:', id);
  console.log('Authenticated user:', req.user.email);

  try {
    const { language, userCode } = req.body;
    const userID = req.user.id; // Get user ID from auth middleware instead of request body

    console.log('✅ Getting unit test data for question:', id);
    const unitTestData = await getById(id);

    if (!unitTestData) {
      console.log('❌ Unit tests not found');
      return res.status(404).json({
        error: "Unit tests not found for this question",
      });
    }

    console.log('✅ Building verification payload...');
    const payload = {
      user_id: userID,
      question_id: id,
      is_problem_generated: 0,
      language,
      runtime: "node18",
      framework: "express",
      test_framework: unitTestData.test_framework,
      http_client: unitTestData.http_client,
      entry: "src/app.js",
      app_files: [{
        path: "src/app.js",
        content: userCode,
      }],
      test_files: unitTestData.test_files,
    };

    try {
      await publishToVerificationQueue(payload);
      console.log("✅ Request sent to verification queue successfully");
    } catch (e) {
      console.error("❌ RabbitMQ publish failed:", e);
      return res.status(503).json({
        error: "Verification service unavailable",
      });
    }

    return res.status(202).json({
      success: true,
      message: "Submission queued for verification",
    });

  } catch (e) {
    console.error('❌ SUBMIT QUESTION ERROR:', e);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { submitQuestion }; // Only exporting submitQuestion now (getQuestionById commented out)

