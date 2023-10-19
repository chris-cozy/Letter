const express = require("express");
const userController = require("../controllers/user");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("", authenticateToken, userController.getUsers);

module.exports = router;
