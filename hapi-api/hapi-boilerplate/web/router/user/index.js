const post = require('./post');
const get = require('./get');
const delet = require('./delete');

module.exports = [].concat(post,
	get,
	delet);
