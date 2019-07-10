const logger = require("winston");
const MongoClient = require("mongodb").MongoClient;

const url = require("./config");

const dbName = "newdb";

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */

var _db;

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      _db = client.db(dbName);
      return callback(err);
    });
  },

  get: function() {
    return _db;
  }
};
