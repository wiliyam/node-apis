const app = require("./app");
const user = require("./user");
const accessToken = require("./accessToken");
const client = require("./client");

module.exports = [].concat(app, user, client, accessToken);
