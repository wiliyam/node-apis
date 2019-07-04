"use strict";

exports.register = (server, options) => {
  server.route({
    method: "*",
    path: "/{any*}",
    handler: function(request, h) {
      return "404 Error! Page Not Found!";
    }
  });
};

exports.pkg = {
  name: "404"
};
