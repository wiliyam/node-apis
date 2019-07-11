

const entity = 'user';

const api = require('./delete');
const patch = require('./patch');
const i18n = require('../../../../../locales');

const header = require('../../../../middleware/validator');

module.exports = [
	{
		method: 'DELETE',
		path: `/${entity}/refreshToken`,
		handler: api.handler,
		vhost: 'localhost',
		config: {
			tags: ['api', entity],
			description: i18n.__('apiDescription').userDeleteRefresh,
			notes: i18n.__('apiDescription').userDeleteRefresh,
			response: api.response,
			validate: {
				headers: header.headerLan,
				payload: api.payload,
				// eslint-disable-next-line max-len
				failAction: (req, reply, source, error) => reply({ message: error.output.payload.message }).code(error.output.statusCode)
			}
		}
	},
	{
		method: 'PATCH',
		path: `/${entity}/refreshToken`,
		handler: patch.handler,
		vhost: 'localhost',
		config: {
			tags: ['api', entity],
			description: i18n.__('apiDescription').userActivateRefresh,
			notes: i18n.__('apiDescription').userActivateRefresh,
			response: patch.response,
			validate: {
				headers: header.headerLan,
				payload: patch.payload,
				// eslint-disable-next-line max-len
				failAction: (req, reply, source, error) => reply({ message: error.output.payload.message }).code(error.output.statusCode)
			}
		}
	}
];
