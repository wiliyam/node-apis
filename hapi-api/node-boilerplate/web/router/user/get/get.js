

const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const logger = require('winston');
const { ObjectID } = require('mongodb');

const user = require('../../../../models/users');
const i18n = require('../../../../locales');

const params = joi.object({
	appName: joi.string().required().default('Loademup').description('App Name'),
	userType: joi.string().required().default('admin').description('user type like customer, admin, provider'),
	userId: joi.objectId().required().default('5a55ac46cad8ff011ab61a8d').description('Mongo Id of user')
}).required();

const handler = (req, reply) => {
	const dbErrResponse = { message: req.i18n.__('genericErrMsg')['500'], code: 500 };
	const notfound = { message: req.i18n.__('genericErrMsg')['404'], code: 404 };

	const getUser = () => new Promise((resolve, reject) => {
		const condition = {
			userId: new ObjectID(req.params.userId),
			appName: req.params.appName,
			userType: req.params.userType
		};
		user.findOne(condition)
			.then((userData) => {
				if (userData) {
					return resolve(userData);
				}
				return reject(notfound);
			}).catch((err) => {
				logger.error('Error while getting user : ', err);
				return reject(dbErrResponse);
			});
	});// validate Refresh token

	getUser()
		.then(userData => reply({ message: req.i18n.__('genericErrMsg')['200'], data: userData }).code(200)).catch((e) => {
			logger.error('User Sync API error =>', e);
			return reply({ message: e.message }).code(e.code);
		});
};

const response = {
	status: {
		200: {
			message: joi.any().default(i18n.__('genericErrMsg')['200']),
			data: joi.any()
		},
		404: {
			message: joi.any().default(i18n.__('genericErrMsg')['404'])
		},
		500: {
			message: joi.any().default(i18n.__('genericErrMsg')['500'])
		}
	}
};// swagger response code

module.exports = { params, handler, response };
