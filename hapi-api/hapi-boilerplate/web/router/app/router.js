

const entity = 'app';

const api = require('./post');
const i18n = require('../../../locales');

const header = require('../../middleware/validator');

module.exports = [
	/**
    * 'Stripe webhook for handling an event ',
    */
	{
		method: 'POST',
		path: `/${entity}/event`,
		handler: api.handler,
		vhost: 'localhost',
		config: {
			tags: ['api', entity],
			description: i18n.__('apiDescription').appEvent,
			notes: i18n.__('apiDescription').appEvent,
			response: api.response,
			validate: {
				payload: api.payload,
				headers: header.headerLan,
				// eslint-disable-next-line max-len
				failAction: (req, reply, source, error) => reply({ message: error.output.payload.message }).code(error.output.statusCode)
			}
		}
	}
];
