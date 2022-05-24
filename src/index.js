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

//Routes
const mainRoute = require("./routes/chat");
app.use(mainRoute);

//database connect
const PORT = process.env.PORT || 4000;
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
