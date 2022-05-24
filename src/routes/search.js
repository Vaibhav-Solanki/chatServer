const express = require("express");
const router = express.Router();
const axios = require("axios");
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    console.log(id);
    let mes = await fetch(
      "https://openlibrary.org/search.json?q=" + id + "&limit=10"
    );
    let data = await mes.json();
    data = data.docs.filter(({ ia }) => ia != undefined);
    data = data.map(({ title, ia }) => {
      return { title: title, ia: ia[0] };
    });
    return res.json({ messages: data });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
