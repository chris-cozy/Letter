const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();

const authRoutes = require("./routes/auth");

app.use("/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Message server running on port ${PORT}`);
});
