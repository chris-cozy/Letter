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

app.use("/v1/auth", authRoutes);
app.use("/v1/messages", messagesRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Message server running on port ${PORT}`);
});

/** WEBSOCKET SERVER */
const wsServer = new ws.WebSocketServer({ server });

wsServer.on("connection", (connection, req) => {
  console.log("Web socket server connected.");

  connection.on("message", async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "auth") {
      const token = parsedMessage.token;
      console.log(token);

      jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if (err) {
          console.error(err);
        }
        const { id, username } = user;
        connection.id = id;
        connection.username = username;
        console.log(username);
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

  // Send list of active clients upon connect
  console.log([...wsServer.clients].map((c) => c.username));
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
});
