const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.pug", {
    title: "My Express App",
    message: "Hello App is running......."
  });
});

module.exports = router;
