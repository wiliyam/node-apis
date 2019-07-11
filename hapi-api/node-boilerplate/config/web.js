

const common = require('./components/common');
const localization = require('./components/localization');
const logger = require('./components/logger');
const mongodb = require('./components/mongodb');
const server = require('./components/server');

module.exports = Object.assign({},
	common,
	localization,
	logger,
	mongodb,
	server);
