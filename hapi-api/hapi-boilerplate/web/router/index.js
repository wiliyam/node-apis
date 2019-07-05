

const app = require('./app');
const user = require('./user');
const accessToken = require('./accessToken');

module.exports = [].concat(app,
	user,
	accessToken);
