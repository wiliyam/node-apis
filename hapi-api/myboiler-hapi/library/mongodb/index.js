const MongoClient = require("mongodb").MongoClient;

const config = require("config");

const db = config.get("dbMode");
var dbName;
if (db == "prod") {
  dbName = "hapiApidb";
} else {
  dbName = "test";
}

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */

console.log(`Trying to connnect with database:${dbName}`);
const url = config.get("dbUrl");
var _db;

module.exports = {
  connectToServer: async function(callback, mode) {
    let err = null;
    try {
      // Use connect method to connect to the Server
      client = await MongoClient.connect(url, { useNewUrlParser: true });
      _db = client.db(dbName);
    } catch (err) {
      err = err;
    }
    return callback(err);
  },

  get: function() {
    return _db;
  }
};
