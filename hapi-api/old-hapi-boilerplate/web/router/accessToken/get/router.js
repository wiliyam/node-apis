

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
		path: `/${entity}/accessToken`,
		handler: api.handler,
		config: {
			tags: ['api', entity],
			description: i18n.__('apiDescription').userAccessToken,
			notes: i18n.__('apiDescription').userAccessToken,
			response: api.response,
			auth: 'accessToken',
			validate: {
				headers: header.headerAuthRefresh,
				// eslint-disable-next-line max-len
				failAction: (req, reply, source, error) => reply({ message: error.output.payload.message }).code(error.output.statusCode)
			}
		}
	}
];
