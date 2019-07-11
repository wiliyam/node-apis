

const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const logger = require('winston');
const moment = require('moment');
const { ObjectID } = require('mongodb');

const user = require('../../../../../models/users');
const i18n = require('../../../../../locales');

const payload = joi.object({
	appName: joi.string().required().default('Loademup').description('App Name'),
	userId: joi.objectId().required().default('5a55ac46cad8ff011ab61a8d').description('Mongo Id of user'),
	userType: joi.string().required().default('admin').description('user type like customer, admin, provider'),
	refreshToken: joi.string().required().default('e0b59810-429e-4551-8028-2042b99dff7b').description('refresh token,Eg. Key'),
	time: joi.number().required().default(0).description('Blacklist Token for (x) seconds, 0 for permanent')
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
		let userData = {
			$pull: {
				activeDevices: {
					refreshToken: req.payload.refreshToken
				}
			}
		};
		if (req.payload.time !== 0) {
			condition['activeDevices.refreshToken'] = req.payload.refreshToken;
			userData = {
				$set: {
					'activeDevices.$.blackListTill': moment.unix(moment().unix() + req.payload.time).toDate()
				}
			};
		}
		user.update(condition, userData)
			.then((data) => {
				if (data.result.nModified === 0) {
					return reject(notfound);
				}
				return resolve(true);
			}).catch((err) => {
				logger.info('Error while getting user : ', err);
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
