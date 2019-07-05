/* eslint-disable indent */

const joi = require('joi');
const logger = require('winston');
const { ObjectID } = require('mongodb');

const user = require('../../../models/users');
const auth = require('../../middleware/authentication');
const i18n = require('../../../locales');

const payload = joi.object({
	pattern: joi.string().required().description('pattern'),
	channel: joi.string().required().description('channel'),
	message: joi.string().required().description('message')
}).required();

const authExpire = (key) => {
	const data = key.split('_');
	const condition = {
		userId: new ObjectID(data[2]),
		appName: data[0],
		userType: data[1]
	};
	const userData = {
		$pull: {
			activeDevices: {
				refreshToken: data[3]
			}
		}
	};
	user.update(condition, userData)
		.then((data) => {
			if (data.result.nModified === 0) {
				logger.info('Refresh Deleted : ', data);
			}
		}).catch((err) => {
			logger.error('Error while getting user : ', err);
		});
};

const resExpire = (key) => {
	const data = key.split('_');
	const condition = {
		userId: new ObjectID(data[2]),
		appName: data[0],
		userType: data[1],
		'activeDevices.refreshToken': data[3]
	};
	user.findOne(condition)
		.then((data) => {
			if (data) {
				const tokenData = {
					userId: data._id.toString(),
					appName: data.appName,
					userType: data.userType,
					multiLogin: data.multiLogin,
					immediateRevoke: data.immediateRevoke
				};
				// eslint-disable-next-line no-unused-vars
				auth.generateRefreshToken(tokenData, data.refreshTokenExpiry, data[3]).then((token) => {
					user.update(condition, { $set: { 'activeDevices.$.blackListTill': '' } })
						.then((data) => {
							if (data.result.nModified === 0) {
								logger.info('Refresh Deleted : ', data);
							}
						}).catch((err) => {
							logger.error('Error while getting user : ', err);
						});
				}).catch((err) => {
					logger.error('Error in generating refresh token : ', err);
				});
			} else {
				logger.info('Refresh Deleted : ', data);
			}
		}).catch((err) => {
			logger.error('Error while getting user : ', err);
		});
};

/**
 *
 * @param {*} pattern
 * @param {*} channel
 * @param {*} message
 */
const redisEventListner = (pattern, channel, message) => {
	let key = '';
	switch (channel) {
		case '__keyevent@1__:hset':
			break;
		case '__keyevent@1__:del':
			break;
		case '__keyevent@1__:expired':
			key = message.split('|');
			switch (key[0]) {
				case 'AUTH':
					authExpire(key[1]);
					break;
				case 'RES':
					resExpire(key[1]);
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
};

const handler = (req, reply) => {
	redisEventListner(req.payload.pattern, req.payload.channel, req.payload.message);
	reply({
		message: 'success for redisEnvent'
	}).code(200);
};


const response = {
	status: {
		200: {
			message: joi.any().default(i18n.__('genericErrMsg')['200'])
		}
	}
};// swagger response code

module.exports = { payload, handler, response };
