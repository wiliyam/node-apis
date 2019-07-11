const post = require("./post");
const get = require("./get");
const delet = require("./delete");
const patch = require("./patch");

module.exports = [].concat(get, post, patch, delet);
