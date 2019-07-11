const logger = require("winston");
const Hapi = require("hapi");
const config = require("../config");
const db = require("../library/mongodb");
const middleware = require("./middleware");

const Server = new Hapi.Server();

Server.connection({
  port: config.server.port,
  host: "0.0.0.0",
  routes: {
    cors: {
      origin: ["*"],
      additionalHeaders: ["lan", "refreshtoken"]
    }
  }
});

/* +_+_+_+_+_+_+_+_+_+_+ Plugins / Middlewares +_+_+_+_+_+_+_+_+_+_+ */

Server.register(require("hapi-auth-jwt2"));
Server.register(
  [
    middleware.good,
    middleware.swagger.inert,
    middleware.swagger.vision,
    middleware.swagger.swagger,
    middleware.localization.i18n
  ],
  err => {
    if (err) Server.log(["error"], `hapi-swagger load error: ${err}`);
    else Server.log(["start"], "hapi-swagger interface loaded");
  }
);

//Server.auth.strategy("accessToken", "jwt", middleware.auth.accessToken);

Server.route(require("./router")); // import the routes

exports.init = async () => {
  await Server.initialize();
  return Server;
};

exports.start = async () => {
  await Server.start();
  logger.info(`Server is listening on port ${Server.info.uri}`);
  await db.connect();
  return Server;
};

exports.stop = async () => {
  await Server.stop();
  logger.info("Server stopped");
};
