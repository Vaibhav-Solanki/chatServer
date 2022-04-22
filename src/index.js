require("dotenv").config();
const express = require("express");
const app = express();

//cors policy
var cors = require("cors");
const { connect } = require("tls");
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    newMes(data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

const model = require("./model/chat");
const newMes = async (data) => {
  try {
    var room = await model.findOne({ room: data.roomId });
    if (room) {
      room.messages = [...room.messages, data];
      await room.save();
    } else
      room = model.create({
        room: data.roomId,
        messages: [data],
      });
  } catch (error) {
    console.log(error);
  }
};

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let mes = await model.findOne({ room: id }).lean().exec();
    return res.json(mes.messages);
  } catch (error) {
    res.json(error);
  }
});
app.get("/", async (req, res) => {
  try {
    let mes = await model.find().lean().exec();
    return res.json({ messages: mes });
  } catch (error) {
    res.json(error);
  }
});

//database connect
const startDb = require("./configs/db");
module.exports = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
    startDb();
  } catch (error) {
    console.log(error);
  }
};
