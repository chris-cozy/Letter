const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");

app.use("/v1/auth", authRoutes);
app.use("/v1/messages", messagesRoutes);
app.use("/v1/user", userRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Message server running on port ${PORT}`);
});

/** WEBSOCKET SERVER */
const wsServer = new ws.WebSocketServer({ server });

wsServer.on("connection", (connection, req) => {
  console.log("Web socket server connected.");

  function sendOnlineUsers() {
    // Send list of active clients to current client upon connect
    [...wsServer.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          type: "online",
          online: [...wsServer.clients].map((c) => ({
            id: c.id,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  // Removing dead clients to update online/offline statuses and save resources
  connection.timer = setInterval(() => {
    if (connection.isAlive) {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        connection.terminate();
        sendOnlineUsers();
        console.log("death");
      }, 2000);
    }
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  connection.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "auth") {
      const token = parsedMessage.token;

      jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) {
          // Handle JWT token expiration error
          if (err.name === "TokenExpiredError") {
            // Send a message to the client indicating token expiration
            connection.send(JSON.stringify({ type: "tokenExpired" }));
            // Optionally, close the connection or handle reauthentication logic
            connection.terminate();
            // Implement reauthentication logic here...
          } else {
            // Handle other JWT verification errors
            console.error(err);
          }
        } else {
          const { id, username } = user;
          connection.id = id;
          connection.username = username;
          console.log(`${username} is connected.`);
        }
      });
    } else if (parsedMessage.type === "message") {
      // Save message to database
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

      [...wsServer.clients]
        .filter((c) => c.id === parsedMessage.message.recipient)
        .forEach((c) => c.send(JSON.stringify(toClient)));
    }
  });

  sendOnlineUsers();
});

wsServer.on("close", (data) => {
  console.log("disconnected", data);
});
