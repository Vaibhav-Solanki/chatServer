const express = require("express");
const router = express.Router();

const model = require("../model/chat");
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let mes = await model.findOne({ room: id }).lean().exec();
    return res.json(mes.messages);
  } catch (error) {
    res.json(error);
  }
});
router.get("/", async (req, res) => {
  try {
    let mes = await model.find().lean().exec();
    return res.json({ messages: mes });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
