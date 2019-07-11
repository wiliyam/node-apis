const db = require("../../library/mongodb");

const tablename = "user";

const findOne = condition =>
  new Promise((resolve, reject) => {
    db.get()
      .collection(tablename)
      .findOne(condition, (err, result) => {
        err ? reject(err) : resolve(result);
      });
  });

const addUser = data =>
  new Promise((resolve, reject) => {
    db.get()
      .collection(tablename)
      .insertOne(data, (err, result) => {
        err ? reject(err) : resolve(result);
      });
  });
const update = (condition, data) =>
  new Promise((resolve, reject) => {
    db.get()
      .collection(tablename)
      .update(condition, data, (err, result) => {
        err ? reject(err) : resolve(result);
      });
  });

const findOneAndUpdate = (condition, data) =>
  new Promise((resolve, reject) => {
    db.get()
      .collection(tablename)
      .findOneAndUpdate(condition, data, { upsert: false }, (err, result) => {
        err ? reject(err) : resolve(result);
      });
  });

const remove = condition =>
  new Promise((resolve, reject) => {
    db.get()
      .collection(tablename)
      .remove(condition, (err, result) => {
        err ? reject(err) : resolve(result);
      });
  });
const findAll = (condition, data) =>
  new Promise((resolve, reject) => {
    db.get()
      .collection(tablename)
      .find(condition, data)
      .toArray((err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
  });

module.exports = {
  findOne,
  addUser,
  findAll,
  update,
  findOneAndUpdate,
  remove
};
