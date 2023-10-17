const express = require("express");
const authController = require("../controllers/auth");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;
