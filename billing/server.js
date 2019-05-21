var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var mongoose = require("mongoose");

app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);
var enableCORS = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, token, Content-Length, X-Requested-With, *"
  );
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(enableCORS);
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/selectyear.html");
});

// routes file
require("./routes")(app);
app.listen(3000, () => {
  console.log("App running on port 3000");
});
