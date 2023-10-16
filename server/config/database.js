const mongoose = require("mongoose");
require("dotenv").config();

// Get the MongoDB connection string from environment variables
const mongoURL = process.env.MONGO_URL;

// Set up options for the mongoose connection
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose
  .connect(mongoURL, options)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose;
