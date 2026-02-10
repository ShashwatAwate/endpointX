const { publishToVerificationQueue } = require("../queue/rabbitmq");

const getQuestionById = (req, res) => {
  const q = questions.find((item) => item.id === req.params.id);

  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(q);
};

// questionID 
//
//
// input req
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
  const { id } = req.params

  try {
    const {
      userID,
      questionID,
      language,
      userCode,
    } = req.body;

    if (userID === undefined || userID === "") {
      throw new Error("user id not found")
    }

    if (questionID !== id) {
      throw new Error("questionID mismatch")
    }

    const unitTestData = getUnitTestFromQuestionID(questionID)

    const appFiles = {
      path: "src/app.js",
      content: userCode,
    }

    const payload = {
      user_id: userID,
      question_id: questionID,
      is_problem_generated: 0,
      language: language,
      runtime: "node18",
      framework: "express",
      test_framework: unitTestData.test_framework,
      http_client: unitTestData.http_client,
      entry: "src/app.js",
      app_files: appFiles,
      test_files: unitTestData.test_files
    };

    await publishToVerificationQueue(payload)

    // published - 200
  } catch (e) {
    console.log(e)
  }
}

module.exports = { getQuestionById, submitQuestion };

