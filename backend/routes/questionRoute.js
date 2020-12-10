const express = require('express');
router = express.Router();
const questionController = require('../controllers/questionController');
const authController = require("../controllers/authController");


router.get("/getAllQuestion", questionController.getAllQuestion);
router.get("/:question_id", authController.tryAuthenticateToken, questionController.getQuestion);
router.get("/:question_id/allInfo", authController.authenticateToken, questionController.getQuestionAllInfo);

router.post("/add_question", authController.authenticateToken, questionController.postQuestion);

router.delete("/:question_id", authController.authenticateToken, questionController.deleteQuestion);

router.patch("/:question_id/upvote", authController.authenticateToken, questionController.upvoteQuestion)


module.exports = router;