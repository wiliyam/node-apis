const user = require('./user');
const refreshToken = require('./refreshToken');

module.exports = [].concat(user,
	refreshToken);
