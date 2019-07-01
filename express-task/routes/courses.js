const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const config = require("config");

const url = config.dbUrl;

var coll;
MongoClient.connect(url, (err, client) => {
  if (err) throw new Error("Failed to connect...");
  console.log("Successfully connected to database....");

  coll = client.db("notebal").collection("notes");
});
router.get("/", (req, res) => {
  coll.find({}).toArray((err, items) => {
    if (err) throw new Error("Enable to show...");
    res.send(JSON.stringify(items));
  });
});

router.post("/", (req, res) => {
  const { error } = validateNote(req.body);
  if (error) {
    return res
      .status(400)
      .send("Tile and text are require and shold be more than 3 letter");
  }

  const note = {
    title: req.body.title,
    text: req.body.text
  };
  coll.insert(note, (err, result) => {
    if (err) throw new Error("Failed to Insert...");
    res.json({
      inserted: "yes",
      result: result.ops
    });
  });
  //res.send(note);
});

router.get("/:id", (req, res) => {
  let id = ObjectID(req.params.id);

  coll.findOne({ _id: id }, (err, item) => {
    if (err) throw new Error("Enable to show...");
    res.json({
      item: item
    });
  });
});

router.put("/:id", (req, res) => {
  let id = ObjectID(req.params.id);
  let note = {
    title: req.body.title,
    text: req.body.text
  };

  coll.updateOne({ _id: id }, { $set: note }, (err, result) => {
    if (err) throw new Error("Enable to show...");
    res.json({
      result: result.result["n"],
      updated: note
    });
  });
});
router.delete("/:id", (req, res) => {
  let id = ObjectID(req.params.id);
  coll.deleteOne({ _id: id }, (err, result) => {
    if (err) throw new Error("Enable to show...");
    res.json({
      result: result.result["n"]
    });
  });
});
function validateNote(course) {
  const schema = {
    title: Joi.string()
      .min(3)
      .required(),
    text: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}
module.exports = router;
