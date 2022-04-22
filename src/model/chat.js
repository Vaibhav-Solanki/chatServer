const { Schema, model } = require("mongoose");
const chatSchema = new Schema({
  room: { type: String, required: true },
  messages: [
    {
      body: { type: String, required: false },
      senderId: { type: String, required: false },
    },
  ],
});
chatSchema.methods.newMessage = function newMessage(id, body) {
  return (this.messages = [...this.messages, { id: id, body: body }]);
};
module.exports = model("chat", chatSchema);
