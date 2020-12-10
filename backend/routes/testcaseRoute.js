const express = require('express');
router = express.Router();
const testcaseController = require('../controllers/testcaseController');
const authController = require("../controllers/authController");

router.get("/:question_id/allTestcase", testcaseController.getTestCases);

router.post("/addTestcase",
    authController.authenticateToken,
    testcaseController.addTestCase);

router.delete(
  "/:question_id/deleteTestcase",
  authController.authenticateToken,
  testcaseController.deleteTestCase
);

module.exports = router;