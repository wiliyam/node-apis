

const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const logger = require('winston');
const { ObjectID } = require('mongodb');

const user = require('../../../../../models/users');
const i18n = require('../../../../../locales');

const payload = joi.object({
	appName: joi.string().required().default('Loademup').description('App Name'),
	userId: joi.objectId().required().default('5a55ac46cad8ff011ab61a8d').description('Mongo Id of user'),
	userType: joi.string().required().default('admin').description('user type like customer, admin, provider')
}).required();

const handler = (req, reply) => {
	const dbErrResponse = { message: req.i18n.__('genericErrMsg')['500'], code: 500 };
	const notfound = { message: req.i18n.__('genericErrMsg')['404'], code: 404 };

	const removeUser = () => new Promise((resolve, reject) => {
		const condition = {
			userId: new ObjectID(req.payload.userId),
			appName: req.payload.appName,
			userType: req.payload.userType
		};
		user.remove(condition)
			.then((data) => {
				if (data.result.n === 0) {
					return reject(notfound);
				}
				return resolve(true);
			}).catch((err) => {
				logger.info('Error while updating user : ', err);
				return reject(dbErrResponse);
			});
	});

	removeUser()
		.then(() => reply({ message: req.i18n.__('genericErrMsg')['200'] }).code(200)).catch((e) => {
			logger.error('User Sync API error =>', e);
			return reply({ message: e.message }).code(e.code);
		});
};

const response = {
	status: {
		200: {
			message: joi.any().default(i18n.__('genericErrMsg')['200'])
		},
		404: {
			message: joi.any().default(i18n.__('genericErrMsg')['404'])
		},
		500: {
			message: joi.any().default(i18n.__('genericErrMsg')['500'])
		}
	}
};// swagger response code

module.exports = { payload, handler, response };
