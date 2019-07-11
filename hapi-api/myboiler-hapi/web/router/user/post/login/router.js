const api = require("./post");

const entity = "user";
exports.pkg = {
  name: "login"
};

exports.register = (server, options) => {
  server.route({
    method: "POST",
    path: `/${entity}/login`,
    handler: api.handler,
    vhost: "localhost",
    config: {
      auth: false,
      tags: ["api", entity],
      description: "API is used for login user",
      validate: {
        payload: api.payload
      }
    }
  });
};
