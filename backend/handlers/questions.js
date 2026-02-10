const { publishToVerificationQueue } = require("../queue/rabbitmq");

const getQuestionById = (req, res) => {
  const q = questions.find((item) => item.id === req.params.id);

  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(q);
};

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

  try {
    const {
      questionID,
      language,
      userCode,
    } = req.body;

    if (!userID) {
      return res.status(400).json({ error: "user id not found" });
    }

    if (questionID !== id) {
      return res.status(400).json({ error: "questionID mismatch" });
    }

    const unitTestData = getUnitTestFromQuestionID(questionID);

    const payload = {
      user_id: "c4a5d29a - c375 - 46bb- 950f-b4b0fc6f3d0a",
      question_id: questionID,
      is_problem_generated: 0,
      language,
      runtime: "node18",
      framework: "express",
      test_framework: unitTestData.test_framework,
      http_client: unitTestData.http_client,
      entry: "src/app.js",
      app_files: {
        path: "src/app.js",
        content: userCode,
      },
      test_files: unitTestData.test_files,
    };

    try {
      await publishToVerificationQueue(payload);
    } catch (e) {
      console.error("rabbitmq publish failed:", e);
      return res.status(503).json({
        error: "Verification service unavailable",
      });
    }

    return res.status(202).json({
      success: true,
      message: "Submission queued for verification",
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = { getQuestionById, submitQuestion };

