require("dotenv").config();
const express = require("express");
const app = express();

//cors policy
var cors = require("cors");
app.use(cors());

//chat server
const chatServer = require("./configs/chatserver");
const server = require("http").createServer(app);
chatServer(server);

const PORT = process.env.PORT || 4000;

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
