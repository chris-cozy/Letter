const express = require("express");
const multer = require("multer");
const path = require("path");

const messagesController = require("../controllers/messages");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads");
    cb(null, uploadDir); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Generate a unique filename
  },
});

const upload = multer({ storage });

router.get(
  "/:mainId/:secondaryId",
  authenticateToken,
  messagesController.getMessages
);

router.post(
  "/file",
  authenticateToken,
  upload.single("file"),
  messagesController.sendFile
);

module.exports = router;
