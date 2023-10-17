const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ws = require("ws");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

const authRoutes = require("./routes/auth");

app.use("/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Message server running on port ${PORT}`);
});

// Websocket server
const wsServer = new ws.WebSocketServer({ server });

wsServer.on("connection", (connection, req) => {
  console.log("Web socket server connected.");

  connection.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "auth") {
      const token = parsedMessage.token;
      console.log(token);
      // Validate and process the authentication token
      // ...
      // Respond back to the client if needed
      connection.send("Token received and validated");
    } else if (parsedMessage.type === "data") {
      // Handle other types of messages (if applicable)
      // ...
    }
  });
});
