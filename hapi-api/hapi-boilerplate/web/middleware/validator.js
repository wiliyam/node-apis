
const joi = require('joi');
const lan = require('./localization');

const headerAuth = joi.object({
	authorization: joi.string().required().description('authorization token,Eg. Key'),
	lan: joi.string().required().default(lan.defaultLan).description('Language(English-0),Eg. 0')
}).options({ allowUnknown: true });

const headerAuthRefresh = joi.object({
	authorization: joi.string().required().description('authorization token,Eg. Key'),
	refreshtoken: joi.string().required().description('refresh token,Eg. Key'),
	lan: joi.string().required().default(lan.defaultLan).description('Language(English-0),Eg. 0')
}).options({ allowUnknown: true });

const headerLan = joi.object({
	lan: joi.string().required().default(lan.defaultLan).description('Language(English-0),Eg. 0')
}).options({ allowUnknown: true });

module.exports = { headerLan, headerAuth, headerAuthRefresh };
