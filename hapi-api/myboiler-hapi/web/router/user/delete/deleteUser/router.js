const api = require("./delete");

const entity = "user";
exports.pkg = {
  name: "deleteUser"
};

exports.register = (server, options) => {
  server.route({
    method: "DELETE",
    path: `/${entity}/deleteUser`,
    handler: api.handler,
    vhost: "localhost",
    config: {
      tags: ["api", entity],
      description: "API is used for delete user",
      validate: {
        payload: api.payload
      }
    }
  });
};
