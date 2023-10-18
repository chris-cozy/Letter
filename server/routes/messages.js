const express = require("express");
const messagesController = require("../controllers/messages");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/:mainId/:secondaryId",
  authenticateToken,
  messagesController.getMessages
);

module.exports = router;
