const express = require('express');
const pool = require('../db');
const router = express.Router();


// POST /question/:questionId -> push to submission pipeline
// return 202
// after getting 202
// GET /submission/:questionId

// /submission/:questionId
router.get("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user.id;

  console.log("work?????")
  console.log(userId, questionId)

  const timeoutMS = 300000;
  const pollIntervalMS = 500;

  const start = Date.now();

  try {
    while (Date.now() - start < timeoutMS) {
      const result = await pool.query(
        `
            SELECT * FROM answers
            WHERE user_id= $1 AND question_id= $2
            LIMIT 1
            `,
        [userId, questionId]
      );

      console.log("got response from the db")

      if (result.rowCount > 0) {
        const row = result.rows[0];
        console.log("db row found: ", row)

        if (row.test_results) {
          return res.status(200).json({
            row
          });
        }
      }

      await new Promise((r) => setTimeout(r, pollIntervalMS));
    }
    return res.status(202).json({
      message: "running"
    });
  }
  catch (err) {
    console.err("Long polling error: ", err);
    return res.status(500).json({ error: "internal error" });
  }
})


module.exports = router;
