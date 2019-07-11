

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
}).required();

const handler = (req, reply) => {
	const dbErrResponse = { message: req.i18n.__('genericErrMsg')['500'], code: 500 };
	const notfound = { message: req.i18n.__('genericErrMsg')['404'], code: 404 };

	const removeBlackList = () => new Promise((resolve, reject) => {
		const condition = {
			userId: new ObjectID(req.payload.userId),
			appName: req.payload.appName,
			userType: req.payload.userType,
			'activeDevices.refreshToken': req.payload.refreshToken
		};
		const userData = {
			$set: {
				'activeDevices.$.blackListTill': ''
			}
		};
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

	const getExpiry = () => new Promise((resolve, reject) => {
		const condition = {
			userId: new ObjectID(req.payload.userId),
			appName: req.payload.appName,
			userType: req.payload.userType
		};
		user.findOne(condition)
			.then((data) => {
				let expireAt = '';
				// eslint-disable-next-line array-callback-return
				data.activeDevices.map((item) => {
					if (item.refreshToken === req.payload.refreshToken) {
						expireAt = moment(item.expiryDate).format('YYYY-MM-DD HH:mm:ss');
					}
				});
				return resolve(expireAt);
			}).catch((err) => {
				logger.info('Error while getting user : ', err);
				return reject(dbErrResponse);
			});
	});

	removeBlackList()
		.then(getExpiry)
		.then((expireAt) => {
			const responseData = {
				expireAt
			};
			return reply({ message: req.i18n.__('genericErrMsg')['200'], data: responseData }).code(200);
		}).catch((e) => {
			logger.error('User Sync API error =>', e);
			return reply({ message: e.message }).code(e.code);
		});
};

const response = {
	status: {
		200: {
			message: joi.any().default(i18n.__('genericErrMsg')['200']),
			data: joi.object({
				expireAt: joi.string().required().default('YYYY-MM-DD HH:mm:ss').description('Refresh Token Expiry Date and time'),
			}).required()
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
