const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: "https://letter-webapp.netlify.app",
};
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");

app.use("/v1/auth", authRoutes);
app.use("/v1/messages", messagesRoutes);
app.use("/v1/user", userRoutes);

const PORT = process.env.PORT || 3000;

const server = https
  .createServer(
    {
      key: fs.readFileSync("secure_key.pem"),
      cert: fs.readFileSync("secure_cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });

/** WEBSOCKET SERVER */
const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  console.log("Web socket server connected.");

  function sendOnlineUsers() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          type: "online",
          online: [...wss.clients].map((c) => ({
            id: c.id,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  // Remove dead clients to update online/offline statuses and save resources
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      console.log("Client death: ", connection.username);
      connection.isAlive = false;
      connection.terminate();
      clearInterval(connection.timer);
    }, 2000);
  }, 5000);

  connection.on("close", () => {
    console.log("Connection closed: ", connection.username);
    sendOnlineUsers();
  });

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  connection.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "auth") {
      const token = parsedMessage.token;

      jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            connection.send(JSON.stringify({ type: "tokenExpired" }));
          } else {
            connection.send(JSON.stringify({ type: "serverError" }));
          }
        } else {
          const { id, username } = user;

          connection.id = id;
          connection.username = username;

          console.log(`${username} is connected.`);
        }
      });
    } else if (parsedMessage.type === "message") {
      const { sender, recipient, text } = parsedMessage.message;
      const newMessage = new Message({
        sender,
        recipient,
        text,
      });

      const savedMessage = await newMessage.save();

      const toClient = {
        type: parsedMessage.type,
        messageId: savedMessage._id,
        message: parsedMessage.message,
      };

      [...wss.clients]
        .filter((c) => c.id === parsedMessage.message.recipient)
        .forEach((c) => c.send(JSON.stringify(toClient)));
    } else if (parsedMessage.type === "logout") {
      connection.terminate();
    }
  });

  sendOnlineUsers();
});

wss.on("close", (data) => {
  console.log("Web Socket Server disconnected. Data: ", data);
});
