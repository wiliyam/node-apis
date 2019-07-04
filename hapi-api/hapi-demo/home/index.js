"use strict";

exports.register = (server, options) => {
  server.route({
    method: "GET",
    path: "/home",
    handler: function(request, h) {
      const name = options.name;
      return `welcome home ${name}`;
    }
  });
};

exports.pkg = {
  name: "home"
};
