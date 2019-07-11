

const joi = require('joi');

const envVarsSchema = joi.object({
	AUTH_DEFAULT_LANGUAGE: joi.string()
		.default('en'),
	AUTH_LANGUAGES: joi.string()
		.default('en')
}).unknown().required();

const envVars = joi.attempt(process.env, envVarsSchema);

const config = {
	localization: {
		DEFAULT_LANGUAGE: envVars.AUTH_DEFAULT_LANGUAGE,
		LANGUAGES: envVars.AUTH_LANGUAGES
	}
};

module.exports = config;
