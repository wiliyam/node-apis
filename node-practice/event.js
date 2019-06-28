const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("messageLogged", () => {
  console.log("Event reaise");
});
emitter.emit("messageLogged");
