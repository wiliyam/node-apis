const express = require("express");

const authenticate = require("./routes/middleware/logger");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startupDebugger = require("debug")("app:startup"); //set DEBUG env-varriable
const dbDebugger = require("debug")("app:db");
const courses = require("./routes/courses");
const home = require("./routes/home");

const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); //default values

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(authenticate);
app.use(helmet());
app.use("/", home);
app.use("/api/courses", courses);

//Always save password in variables
//confirguration
// console.log("Application name:", config.get("name"));
// console.log("Mail name:", config.get("mail"));
//console.log("Mail Password:", process.env);
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan is Enable");
}

//console.log("NODE_ENV", process.env.NODE_ENV);
//console.log("App", app.get("env"));

//DB debugger
dbDebugger("db debug....");

app.listen(PORT, () => {
  console.log("App is Running On:", PORT);
});
