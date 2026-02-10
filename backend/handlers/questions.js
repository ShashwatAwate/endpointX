const getQuestionById = (req, res) => {
  const q = questions.find((item) => item.id === req.params.id);

  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(q);
};

const submitQuestion = (req, res) => {

}

module.exports = { getQuestionById, submitQuestion };

