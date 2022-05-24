module.exports = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

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

  //save msg on db
  const model = require("../model/chats");
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
};
