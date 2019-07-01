const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

url =
  "mongodb+srv://wiliyam:9909615234@cluster0-ttamt.mongodb.net/test?retryWrites=true&w=majority";
const noteSchema = new Schema({
  title: String,
  text: String,
  price: Number,
  date: { type: Date, default: Date.now() }
});

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("sucessfully connect to db........");
  })
  .catch(() => {
    console.log("Failed to connect...");
  });

const Notes = mongoose.model("notes", noteSchema);

async function createNote() {
  const notes = Notes({
    title: "a",
    text: "sscscscscsd",
    price: 500
  });

  const result = await notes.save();
  console.log("Note created..");
}

createNote();

// async function getNotes() {
//   const notes = await Notes.find({ price: { $gt: 100 } })
//     //.find()
//     //.or({ title: "a" }, { price: 60 })
//     //.and([{ title: "a" }, { price: 60 }])
//     //.find({ title: /^a/ }) //regular expression start with a
//     .limit(10)
//     .sort({ title: 1 })
//     .select({ title: 1, price: 1 });
//   //.limit(pageSize) .skip((pageNumber - 1) * pageSize); //pagination
//   //.count(); count documents
//   console.log(notes);
// }

// getNotes();
