const express = require('express');
const pool = require('../db');
const router = express.Router();


// /submission/:questionId
router.get("/:questionId", async (req, res) => {
 const {questionId} = req.params;
 const userId = req.userId;

 const timeoutMS = 250000;
 const pollIntervalMS = 500;

 const start = Date.now();

 try{
    while(Date.now() - start < timeoutMS){
        const result = await pool.query(
            `
            SELECT id, test_results FROM answers
            WHERE user_id= $1 AND question_id= $2
            LIMIT 1
            `,
            [userId,questionId]
        );

        if (result.rowCount > 0){
            const row = result.rows[0];

            if(row.test_results){
                return res.status(200).json({
                    answer_id: row.id,
                    test_results: row.test_results
                });
            }
        }

        await new Promise((r) => setTimeout(r,pollIntervalMS));
    }
    return res.status(202).json({
        message:"running"
    });
 }
 catch(err){
    console.err("Long polling error: ", err);
    return res.status(500).json({error:"internal error"});
 }
})


module.exports = router;
