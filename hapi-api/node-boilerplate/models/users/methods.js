/* eslint-disable chai-friendly/no-unused-expressions */
/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
const db = require('../../library/mongodb');

const tablename = 'user';

const findOne = condition => new Promise((resolve, reject) => {
	db.get().collection(tablename)
		.findOne(condition, (err, result) => {
			err ? reject(err) : resolve(result);
		});
});

const update = (condition, data) => new Promise((resolve, reject) => {
	db.get().collection(tablename)
		.update(condition, data, (err, result) => {
			err ? reject(err) : resolve(result);
		});
});

const findOneAndUpdate = (condition, data) => new Promise((resolve, reject) => {
	db.get().collection(tablename)
		.findOneAndUpdate(condition, data, { upsert: true }, ((err, result) => {
			err ? reject(err) : resolve(result);
		}));
});

const remove = condition => new Promise((resolve, reject) => {
	db.get().collection(tablename)
		.remove(condition, (err, result) => {
			err ? reject(err) : resolve(result);
		});
});

module.exports = {
	findOne,
	update,
	findOneAndUpdate,
	remove
};
