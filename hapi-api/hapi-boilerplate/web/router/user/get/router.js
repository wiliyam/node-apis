

const entity = 'user';

const api = require('./get');
const i18n = require('../../../../locales');

const header = require('../../../middleware/validator');

module.exports = [
	/**
    * 'Stripe webhook for handling an event ',
    */
	{
		method: 'GET',
		path: `/${entity}/{appName}/{userType}/{userId}`,
		handler: api.handler,
		vhost: 'localhost',
		config: {
			tags: ['api', entity],
			description: i18n.__('apiDescription').userGet,
			notes: i18n.__('apiDescription').userGet,
			response: api.response,
			validate: {
				headers: header.headerLan,
				params: api.params,
				// eslint-disable-next-line max-len
				failAction: (req, reply, source, error) => reply({ message: error.output.payload.message }).code(error.output.statusCode)
			}
		}
	}
];
