const api = require("./patch");

const entity = "user";
exports.pkg = {
  name: "updateUser"
};

exports.register = (server, options) => {
  server.route({
    method: "PATCH",
    path: `/${entity}/updateUser`,
    handler: api.handler,
    vhost: "localhost",
    config: {
      tags: ["api", entity],
      description: "API is used for Update user details",
      validate: {
        payload: api.payload
      }
    }
  });
};
