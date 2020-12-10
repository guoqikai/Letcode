const express = require('express');
const authController = require("../controllers/authController");

router = express.Router();

const answerController = require('../controllers/answerController')

router.get("/:question_id/getAnswers",  answerController.getAnswers);
router.post("/:question_id/postAnswer", authController.authenticateToken, answerController.postAnswer);
router.delete("/:question_id/deleteAnswer", answerController.deleteAnswer);

module.exports = router;