const express = require('express');
router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController');


router.get("/:user_id?", authController.tryAuthenticateToken, userController.getUser);
router.get("/:user_id/postHistory",  userController.getUserPostHistory);
router.get("/:user_id/collections", userController.getUserCollection);

router.patch('/:question_id/collect', authController.authenticateToken, userController.collectQuestion)
router.patch('/:question_id/uncollect', authController.authenticateToken, userController.uncollectQuestion)

//change user info

module.exports = router;