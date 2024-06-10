const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinSession", ({ sessionId }) => {
    socket.join(sessionId);
    console.log(`Client joined session: ${sessionId}`);
  });

  socket.on("newContent", ({ sessionId, content }) => {
    io.in(sessionId).emit("updateContent", content);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = (req, res) => {
  res.status(200).send("Server is running");
};
