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
        
    }
 }
 catch{

 }
})


module.exports = router;
