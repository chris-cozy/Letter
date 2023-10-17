const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

const authRoutes = require("./routes/auth");

app.use("/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Message server running on port ${PORT}`);
});
