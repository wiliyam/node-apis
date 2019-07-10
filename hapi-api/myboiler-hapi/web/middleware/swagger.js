const config = require("../../config");

const options = {
  grouping: "tags",
  payloadType: "form",
  host: config.server.server.appurl,
  info: {
    contact: {
      name: "Wiliyam Bhadani",
      email: "wiliyambhadani@gmail.com"
    }
  }
};

module.exports = {
  plugin: require("hapi-swagger"),
  options
};
