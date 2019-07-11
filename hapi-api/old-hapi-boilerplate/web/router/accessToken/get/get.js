
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const logger = require('winston');
const moment = require('moment');
const { ObjectID } = require('mongodb');

const user = require('../../../../models/users');
const auth = require('../../../middleware/authentication');
const i18n = require('../../../../locales');

const handler = (req, reply) => {
	const dbErrResponse = { message: req.i18n.__('genericErrMsg')['500'], code: 500 };
	const invalidCode = { message: req.i18n.__('genericErrMsg')['417'], code: 417 };

	const validateRefreshToken = () => new Promise((resolve, reject) => {
		const condition = {
			userId: new ObjectID(req.auth.credentials.userId),
			appName: req.auth.credentials.appName,
			userType: req.auth.credentials.userType,
			activeDevices: {
				$elemMatch: {
					deviceId: req.auth.credentials.deviceId,
					refreshToken: req.auth.credentials.accessCode,
					expiryDate: { $gt: moment().toDate() },
					blackListTill: ''
				}
			}
		};
		user.findOne(condition)
			.then((userData) => {
				if (userData) {
					return resolve(userData);
				}
				logger.error('matching user not found');
				return reject(invalidCode);
			}).catch((err) => {
				logger.error('Error while getting user : ', err);
				return reject(dbErrResponse);
			});
	});// validate Refresh token

	const generateAccessToken = userData => new Promise((resolve, reject) => {
		const tokenData = {
			userId: req.auth.credentials.userId.toString(),
			appName: req.auth.credentials.appName,
			userType: req.auth.credentials.userType,
			deviceId: req.auth.credentials.deviceId,
			accessCode: req.auth.credentials.accessCode,
			multiLogin: req.auth.credentials.multiLogin,
			immediateRevoke: req.auth.credentials.immediateRevoke
		};
		auth.generateAccessToken(tokenData, userData.accessTokenExpiry).then((token) => {
			userData.accessToken = token;
			resolve(userData);
		}).catch((err) => {
			logger.error('Error in Signing JWT : ', err);
			return reject(dbErrResponse);
		});
	});// generate Access token

	validateRefreshToken()
		.then(generateAccessToken)
		.then((userData) => {
			const responseData = {
				accessToken: userData.accessToken,
				accessExpiry: userData.accessTokenExpiry
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
				accessToken: joi.string().required().default('fdfsaf-fdasf-fdsaf-fasdf').description('Refresh Token'),
				accessExpiry: joi.number().required().default(172800).description('Access Token Expiry Time in second (eg. 2 days = 172800)')
			}).required()
		},
		401: {
			message: joi.any().default(i18n.__('genericErrMsg')['401'])
		},
		403: {
			message: joi.any().default(i18n.__('genericErrMsg')['403'])
		},
		417: {
			message: joi.any().default(i18n.__('genericErrMsg')['417'])
		},
		500: {
			message: joi.any().default(i18n.__('genericErrMsg')['500'])
		}
	}
};// swagger response code

module.exports = { handler, response };
