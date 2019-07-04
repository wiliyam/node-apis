"use strict";

const Glue = require("@hapi/glue");

module.exports = {
  server: {
    port: 3000
  },
  register: {
    plugins: [
      {
        plugin: require("./home"),
        options: {
          name: "wiliyam"
        }
      },
      {
        plugin: require("./404")
      }
    ]
  }
};
