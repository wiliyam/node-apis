

const entity = 'user';

const api = require('./post');
const i18n = require('../../../../locales');

const header = require('../../../middleware/validator');

module.exports = [
	/**
    * 'Stripe webhook for handling an event ',
    */
	{
		method: 'POST',
		path: `/${entity}/login`,
		handler: api.handler,
		vhost: 'localhost',
		config: {
			tags: ['api', entity],
			description: i18n.__('apiDescription').userLogin,
			notes: i18n.__('apiDescription').userLogin,
			response: api.response,
			validate: {
				headers: header.headerLan,
				payload: api.payload,
				// eslint-disable-next-line max-len
				failAction: (req, reply, source, error) => reply({ message: error.output.payload.message }).code(error.output.statusCode)
			}
		}
	}
];
