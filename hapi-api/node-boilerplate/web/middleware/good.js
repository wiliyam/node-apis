
const goodLib = require('good');

const good = {
	register: goodLib,
	options: {
		reporters: {
			myConsoleReporter: [
				{ module: 'good-console' },
				'stdout'
			]
		}
	}
};

module.exports = good;
