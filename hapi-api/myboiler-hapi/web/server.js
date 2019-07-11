"use strict";

const Glue = require("@hapi/glue");
const manifest = require("./manifest");
const Db = require("../library/mongodb");

const options = {
  relativeTo: __dirname
};

let server;
exports.startServer = async function(mode) {
  try {
    server = await Glue.compose(
      manifest,
      options
    );
    await server.start();
    console.log(`sever running on ${manifest.server.port}`);
    await Db.connectToServer(err => {
      if (err) return console.log(err);
      console.log("SuccessFully connected to database....");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
exports.stopServer = async function() {
  await server.stop();
};
