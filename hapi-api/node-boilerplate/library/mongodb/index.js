const logger = require("winston");
const mongodb = require("mongodb");
const url = require("./config");

const state = { db: null };

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */

exports.connect = async () => {
  if (state.db) return;

  const client = await mongodb.connect(url).catch(err => {
    logger.error(`MongoDB error connecting to ${url}`, err.message);
  });
  logger.info("MongoDB connected successfully -------------");
  state.db = client;
};

/**c
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.get = () => state.db;

/**
 * Method to close the mongodb connection
 */
exports.close = callback => {
  if (state.db) {
    state.db.close(err => {
      state.db = null;
      state.mode = null;
      return callback(err);
    });
  }
};
