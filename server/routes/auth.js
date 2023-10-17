const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/register", authController.registerUser);

router.get("/profile", authController.getProfile);

module.exports = router;
